import React, { useEffect, useRef } from "react";

const NeuralBackground: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Configuration
		const PARTICLE_COUNT = 80; // Reduced slightly to make room for words
		const KEYWORD_COUNT = 15;
		const CONNECTION_DISTANCE = 110;
		const BASE_SPEED = 0.5;
		const SCROLL_SPEED_MULTIPLIER = 2.0;

		// Tech keywords
		const KEYWORDS = [
			"Node.js",
			"Buffers",
			"HashSet",
			"Cryptography",
			"Stream",
			"Async",
			"Await",
			"HTTP",
			"JSON",
			"API",
			"404",
			"200",
			"POST",
			"GET",
			"Error",
			"Deploy",
			"Build",
			"Run",
			"Cache",
			"Server",
			"Client",
			"Debug",
			"Test",
			"Commit",
			"Push",
			"Pull",
			"Merge",
			"CI/CD",
			"Docker",
			"Bun",
			"yield",
			"generators",
			"LLM",
			"OpenAI",
			"GPT-4",
			"TypeScript",
		];

		// State
		let width = 0;
		let height = 0;
		let requestID: number;
		let scrollY = window.scrollY;
		let targetScrollY = scrollY;

		// Mouse Parallax
		let mouseX = 0;
		let mouseY = 0;
		let targetMouseX = 0;
		let targetMouseY = 0;

		interface Entity {
			x: number;
			y: number;
			z: number;
			size: number; // Font size for words, radius for dots
			type: "dot" | "word";
			text?: string;
		}

		const entities: Entity[] = [];

		const initEntities = () => {
			entities.length = 0;

			// Create Dots
			for (let i = 0; i < PARTICLE_COUNT; i++) {
				entities.push({
					x: (Math.random() - 0.5) * window.innerWidth * 1.5,
					y: (Math.random() - 0.5) * window.innerHeight * 1.5,
					z: Math.random() * 2000,
					size: Math.random() * 2 + 0.5,
					type: "dot",
				});
			}

			// Create Floating Keywords
			for (let i = 0; i < KEYWORD_COUNT; i++) {
				entities.push({
					x: (Math.random() - 0.5) * window.innerWidth * 1.2,
					y: (Math.random() - 0.5) * window.innerHeight * 1.2,
					z: Math.random() * 2000,
					size: Math.random() * 10 + 10, // Font size 10-20
					type: "word",
					text: KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
				});
			}
		};

		const resize = () => {
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
			initEntities();
		};
		window.addEventListener("resize", resize);
		resize();

		const handleScroll = () => {
			targetScrollY = window.scrollY;
		};
		window.addEventListener("scroll", handleScroll);

		const handleMouseMove = (e: MouseEvent) => {
			targetMouseX = (e.clientX - width / 2) * 0.05;
			targetMouseY = (e.clientY - height / 2) * 0.05;
		};
		window.addEventListener("mousemove", handleMouseMove);

		const animate = () => {
			// Smooth Scroll & Mouse Interpolation
			scrollY += (targetScrollY - scrollY) * 0.1;
			mouseX += (targetMouseX - mouseX) * 0.1;
			mouseY += (targetMouseY - mouseY) * 0.1;

			// Clear Canvas
			ctx.clearRect(0, 0, width, height);

			// Check Theme for Colors
			const isDark = document.documentElement.classList.contains("dark");

			// Light Mode: Darker Grey for particles (Slate-700), Darker Brand Green for lines
			// Dark Mode: White for particles, Bright Brand Green for lines
			const dotColor = isDark
				? "rgba(255, 255, 255, 0.8)"
				: "rgba(51, 65, 85, 0.8)";
			const wordColor = isDark
				? "rgba(74, 222, 128, 0.6)"
				: "rgba(21, 128, 61, 0.6)"; // Brand Green for words
			const lineColorBase = isDark ? "74, 222, 128" : "21, 128, 61"; // RGB components for line

			// Calculate speed
			const scrollSpeed = (targetScrollY - scrollY) * SCROLL_SPEED_MULTIPLIER;
			const moveSpeed = BASE_SPEED + Math.abs(scrollSpeed * 0.1);

			const cx = width / 2;
			const cy = height / 2;

			const activeDots: { sx: number; sy: number; z: number }[] = [];

			entities.forEach((p, index) => {
				// Move particle towards camera
				p.z -= moveSpeed;

				// Loop
				if (p.z <= 0) {
					p.z = 2000;
					p.x = (Math.random() - 0.5) * width * 1.5;
					p.y = (Math.random() - 0.5) * height * 1.5;
					// Randomize word on reset
					if (p.type === "word") {
						p.text = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
					}
				}

				// Parallax
				const parallaxX = p.x - mouseX;
				const parallaxY = p.y - mouseY;

				// Projection
				const fov = 1000;
				const scale = fov / (fov + p.z);
				const sx = cx + parallaxX * scale;
				const sy = cy + parallaxY * scale;

				// Draw
				if (sx > -100 && sx < width + 100 && sy > -50 && sy < height + 50) {
					const alpha = Math.min(1, (2000 - p.z) / 500); // Fade in from distance

					if (p.type === "dot") {
						ctx.beginPath();
						ctx.arc(sx, sy, p.size * scale, 0, Math.PI * 2);
						ctx.fillStyle = dotColor;
						ctx.fill();
						activeDots.push({ sx, sy, z: p.z }); // Store for connections
					} else if (p.type === "word" && p.text) {
						ctx.font = `${p.size * scale}px monospace`;
						ctx.fillStyle = wordColor; // Specific color for words
						ctx.fillText(p.text, sx, sy);
					}
				}
			});

			// Draw Connections (Dots only)
			for (let i = 0; i < activeDots.length; i++) {
				const d1 = activeDots[i];

				for (let j = i + 1; j < activeDots.length; j++) {
					const d2 = activeDots[j];

					// Optimization: Z-distance check
					if (Math.abs(d1.z - d2.z) > 200) continue;

					const dx = d1.sx - d2.sx;
					const dy = d1.sy - d2.sy;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < CONNECTION_DISTANCE) {
						const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.4; // Base opacity
						ctx.beginPath();
						ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity})`;
						ctx.lineWidth = 1;
						ctx.moveTo(d1.sx, d1.sy);
						ctx.lineTo(d2.sx, d2.sy);
						ctx.stroke();
					}
				}
			}

			requestID = requestAnimationFrame(animate);
		};

		requestID = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(requestID);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-0 w-full h-full pointer-events-none"
		/>
	);
};

export default NeuralBackground;
