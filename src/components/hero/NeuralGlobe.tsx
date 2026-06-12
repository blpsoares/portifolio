import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { onAgentState } from '../../agent/bus';

/* ============================================================
   Neural Globe — a sphere of glowing nodes wired into a thin
   network. Click + drag to rotate (with inertia). When bra.ia
   is processing a question it lights up and accelerates, like a
   brain thinking. Teal / emerald on dark. Desktop-only, lazy.
   ============================================================ */

const TEAL = new THREE.Color('#2dd4bf');
const EMERALD = new THREE.Color('#34d399');
const DEEP = new THREE.Color('#0d9488');

const NODE_COUNT = 130;
const RADIUS = 2.2;
const MAX_LINK_DIST = 1.15;
const MAX_LINKS = 220;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

interface NodeData {
  pos: THREE.Vector3;
  color: THREE.Color;
}
interface LinkData {
  a: number;
  b: number;
}

function buildNodes(count: number): NodeData[] {
  const nodes: NodeData[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const color = TEAL.clone().lerp(EMERALD, Math.random());
    nodes.push({ pos: new THREE.Vector3(x, y, z).multiplyScalar(RADIUS), color });
  }
  return nodes;
}

function buildLinks(nodes: NodeData[], maxLinks: number): LinkData[] {
  const links: LinkData[] = [];
  for (let i = 0; i < nodes.length && links.length < maxLinks; i++) {
    for (let j = i + 1; j < nodes.length && links.length < maxLinks; j++) {
      if (nodes[i].pos.distanceTo(nodes[j].pos) < MAX_LINK_DIST) {
        links.push({ a: i, b: j });
      }
    }
  }
  return links;
}

const Network: React.FC<{ reduced: boolean; compact?: boolean }> = ({ reduced, compact = false }) => {
  const group = useRef<THREE.Group>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const pulseMat = useRef<THREE.PointsMaterial>(null);
  const { gl } = useThree();

  // Drag + inertia state.
  const dragging = useRef(false);
  const rotX = useRef(0.15);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);

  // "Thinking" intensity (0..1), lerped toward the chat's state.
  const thinking = useRef(false);
  const proc = useRef(0);

  const { nodes, links } = useMemo(() => {
    const n = buildNodes(compact ? 70 : NODE_COUNT);
    return { nodes: n, links: buildLinks(n, compact ? 120 : MAX_LINKS) };
  }, [compact]);

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      positions[i * 3] = n.pos.x;
      positions[i * 3 + 1] = n.pos.y;
      positions[i * 3 + 2] = n.pos.z;
      colors[i * 3] = n.color.r;
      colors[i * 3 + 1] = n.color.g;
      colors[i * 3 + 2] = n.color.b;
    });
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [nodes]);

  const linesGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(links.length * 6);
    links.forEach((l, i) => {
      const a = nodes[l.a].pos;
      const b = nodes[l.b].pos;
      positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [links, nodes]);

  const PULSE_COUNT = reduced ? 0 : compact ? 8 : 18;
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, () => ({
        link: Math.floor(Math.random() * links.length),
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.5,
      })),
    [PULSE_COUNT, links.length],
  );

  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Math.max(PULSE_COUNT, 1) * 3), 3));
    return g;
  }, [PULSE_COUNT]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Subscribe to the chat's thinking state.
  useEffect(() => onAgentState((s) => (thinking.current = s === 'thinking')), []);

  // Click + drag to rotate (with inertia). DOM-level so the whole canvas drags.
  useEffect(() => {
    if (reduced || compact) return;
    const el = gl.domElement;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX.current = 0;
      velY.current = 0;
      el.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = (e.clientX - lastX) * 0.006;
      const dy = (e.clientY - lastY) * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY.current += dx;
      rotX.current = clamp(rotX.current + dy, -1.25, 1.25);
      velY.current = dx;
      velX.current = dy;
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      el.style.cursor = 'grab';
      document.body.style.userSelect = '';
    };
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.userSelect = '';
    };
  }, [gl, reduced]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (reduced) {
      g.rotation.set(0.15, 0.4, 0);
      return;
    }

    // Ease the processing intensity toward the target.
    proc.current += ((thinking.current ? 1 : 0) - proc.current) * Math.min(1, delta * 3);
    const p = proc.current;

    // Rotation: auto-spin + inertia when not dragging; faster while thinking.
    if (!dragging.current) {
      rotY.current += delta * (0.12 + p * 0.7) + velY.current;
      rotX.current = clamp(rotX.current + velX.current, -1.25, 1.25);
      velY.current *= 0.93;
      velX.current *= 0.93;
    }
    g.rotation.x = rotX.current;
    g.rotation.y = rotY.current;

    // Gentle breathing — small enough to never clip against the canvas.
    const breathe = 1 + Math.sin(state.clock.elapsedTime * (0.6 + p * 1.4)) * (0.006 + p * 0.012);
    g.scale.setScalar(breathe);

    // Materials light up while thinking.
    if (linesMat.current) linesMat.current.opacity = 0.22 + p * 0.4;
    if (pointsMat.current) pointsMat.current.size = 0.085 + p * 0.05;
    if (pulseMat.current) pulseMat.current.size = 0.16 + p * 0.16;

    // Travelling pulses — zoom along the links while thinking.
    const arr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pulses.length; i++) {
      const pu = pulses[i];
      pu.t += delta * pu.speed * (1 + p * 3);
      if (pu.t > 1) {
        pu.t = 0;
        pu.link = Math.floor(Math.random() * links.length);
        pu.speed = 0.25 + Math.random() * 0.5;
      }
      const l = links[pu.link];
      tmp.copy(nodes[l.a].pos).lerp(nodes[l.b].pos, pu.t);
      arr.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    arr.needsUpdate = true;
  });

  return (
    <group ref={group} rotation={[0.15, 0, 0]}>
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial
          ref={linesMat}
          color={DEEP}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points geometry={pointsGeo}>
        <pointsMaterial
          ref={pointsMat}
          size={0.085}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {PULSE_COUNT > 0 && (
        <points geometry={pulseGeo}>
          <pointsMaterial
            ref={pulseMat}
            color={EMERALD}
            size={0.16}
            sizeAttenuation
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};

interface NeuralGlobeProps {
  reducedMotion?: boolean;
  /** smaller node/link/pulse counts + no drag — for the chat header */
  compact?: boolean;
}

const NeuralGlobe: React.FC<NeuralGlobeProps> = ({ reducedMotion = false, compact = false }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, compact ? 5.6 : 7.8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ background: 'transparent', touchAction: compact ? 'auto' : 'none' }}
    >
      <ambientLight intensity={0.6} />
      <Network reduced={reducedMotion} compact={compact} />
    </Canvas>
  );
};

export default NeuralGlobe;
