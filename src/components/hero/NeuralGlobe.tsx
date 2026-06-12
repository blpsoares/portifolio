import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================
   Neural Globe — a sphere of glowing nodes wired into a thin
   network, rotating slowly with pulses travelling the links.
   Teal / emerald palette on dark. Desktop-only, lazy-loaded.
   ============================================================ */

const TEAL = new THREE.Color('#2dd4bf');
const EMERALD = new THREE.Color('#34d399');
const DEEP = new THREE.Color('#0d9488');

const NODE_COUNT = 130;
const RADIUS = 2.2;
const MAX_LINK_DIST = 1.15; // links between nodes closer than this
const MAX_LINKS = 220; // hard cap on rendered edges

interface NodeData {
  pos: THREE.Vector3;
  color: THREE.Color;
}

interface LinkData {
  a: number;
  b: number;
}

/** Evenly distribute points on a sphere via the Fibonacci spiral. */
function buildNodes(): NodeData[] {
  const nodes: NodeData[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2; // 1 -> -1
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const color = TEAL.clone().lerp(EMERALD, Math.random());
    nodes.push({ pos: new THREE.Vector3(x, y, z).multiplyScalar(RADIUS), color });
  }
  return nodes;
}

function buildLinks(nodes: NodeData[]): LinkData[] {
  const links: LinkData[] = [];
  for (let i = 0; i < nodes.length && links.length < MAX_LINKS; i++) {
    for (let j = i + 1; j < nodes.length && links.length < MAX_LINKS; j++) {
      if (nodes[i].pos.distanceTo(nodes[j].pos) < MAX_LINK_DIST) {
        links.push({ a: i, b: j });
      }
    }
  }
  return links;
}

const Network: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const { nodes, links } = useMemo(() => {
    const n = buildNodes();
    return { nodes: n, links: buildLinks(n) };
  }, []);

  // Node points geometry.
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

  // Static line segments geometry for the network edges.
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

  // Travelling pulses: a handful of dots that slide along random links.
  const PULSE_COUNT = reduced ? 0 : 18;
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, () => ({
        link: Math.floor(Math.random() * links.length),
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.5,
      })),
    [PULSE_COUNT, links.length]
  );

  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Math.max(PULSE_COUNT, 1) * 3), 3));
    return g;
  }, [PULSE_COUNT]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (reduced) {
      // Static, faintly tilted presentation — no motion.
      g.rotation.set(0.15, 0.4, 0);
      return;
    }

    // Slow auto-rotation.
    g.rotation.y += delta * 0.12;

    // Damped mouse parallax — tilt the globe gently toward the cursor.
    const k = Math.min(1, delta * 2.5);
    const targetX = 0.15 + mouse.y * 0.22;
    const targetZ = mouse.x * 0.18;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.z += (targetZ - g.rotation.z) * k;

    // Subtle breathing of the whole globe.
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.012;
    g.scale.setScalar(breathe);

    // Advance pulses and update their positions along their links.
    const arr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.t += delta * p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.link = Math.floor(Math.random() * links.length);
        p.speed = 0.25 + Math.random() * 0.5;
      }
      const l = links[p.link];
      tmp.copy(nodes[l.a].pos).lerp(nodes[l.b].pos, p.t);
      arr.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    arr.needsUpdate = true;
  });

  return (
    <group ref={group} rotation={[0.15, 0, 0]}>
      {/* Network edges */}
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial
          color={DEEP}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      <points geometry={pointsGeo}>
        <pointsMaterial
          size={0.085}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Travelling pulses */}
      {PULSE_COUNT > 0 && (
        <points geometry={pulseGeo}>
          <pointsMaterial
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

      {/* Faint inner core glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.55, 24, 24]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

interface NeuralGlobeProps {
  /** Skip all animation for prefers-reduced-motion users. */
  reducedMotion?: boolean;
}

const NeuralGlobe: React.FC<NeuralGlobeProps> = ({ reducedMotion = false }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <Network reduced={reducedMotion} />
    </Canvas>
  );
};

export default NeuralGlobe;
