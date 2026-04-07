"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface CityData {
    name: string;
    location: [number, number];
    targetPhi: number;
}

// COBE phi: ~0 = Prime Meridian (Europe). US is roughly at phi ~4.9-5.5
// To show the US centered, we use phi values in the 5.0 range
const cities: CityData[] = [
    { name: "Austin", location: [30.2672, -97.7431], targetPhi: 5.3 },
    { name: "Miami", location: [25.7617, -80.1918], targetPhi: 5.0 },
    { name: "New York", location: [40.7128, -74.006], targetPhi: 4.9 },
    { name: "San Francisco", location: [37.7749, -122.4194], targetPhi: 5.6 },
];

const ease = [0.16, 1, 0.3, 1] as const;
const INITIAL_PHI = 5.2; // Centers on the US
const THETA = 0.15;

// Project a lat/lng marker to 2D screen coords — matches COBE's exact shader math.
function projectMarker(lat: number, lng: number, phi: number, theta: number) {
    const latRad = (lat * Math.PI) / 180;
    const a = (lng * Math.PI) / 180 - Math.PI;

    const cosLat = Math.cos(latRad);
    const wx = -cosLat * Math.cos(a);
    const wy = Math.sin(latRad);
    const wz = cosLat * Math.sin(a);

    const cp = Math.cos(phi), sp = Math.sin(phi);
    const ct = Math.cos(theta), st = Math.sin(theta);

    const sx = wx * cp + wz * sp;
    const sy = wx * sp * st + wy * ct - wz * cp * st;
    const sz = -wx * sp * ct + wy * st + wz * cp * ct;

    return { x: sx, y: -sy, visible: sz > 0 };
}

const GLOBE_SCALE = 40;

export default function AlphaCampuses() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const phiRef = useRef(INITIAL_PHI);
    const targetPhiRef = useRef<number | null>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);

    const [selectedCity, setSelectedCity] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    // Parallax reveal
    const y = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"]);

    // Slow scroll rotation: small swing keeping US visible
    const scrollPhi = useTransform(scrollYProgress, [0, 1], [INITIAL_PHI, INITIAL_PHI + Math.PI * 0.15]);

    // Globe fade-in
    const globeOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    // Sync scroll phi to ref (only when no city is selected and not dragging)
    useEffect(() => {
        const unsubscribe = scrollPhi.on("change", (v) => {
            if (targetPhiRef.current === null && pointerInteracting.current === null) {
                phiRef.current = v;
            }
        });
        return unsubscribe;
    }, [scrollPhi]);

    // Handle city selection
    const handleCityClick = useCallback((index: number) => {
        if (selectedCity === index) {
            setSelectedCity(null);
            targetPhiRef.current = null;
        } else {
            setSelectedCity(index);
            targetPhiRef.current = cities[index].targetPhi;
        }
    }, [selectedCity]);

    // COBE globe — recreate when selectedCity changes
    useEffect(() => {
        if (!canvasRef.current) return;

        let globe: ReturnType<typeof import("cobe")["default"]> | undefined;
        let onResize: (() => void) | undefined;

        import("cobe").then(({ default: createGlobe }) => {
            if (!canvasRef.current) return;

            let width = canvasRef.current.offsetWidth;

            onResize = () => {
                if (canvasRef.current) {
                    width = canvasRef.current.offsetWidth;
                }
            };
            window.addEventListener("resize", onResize);

            const markers = cities.map((city, i) => ({
                location: city.location,
                size: selectedCity === i ? 0.12 : 0.07,
            }));

            globe = createGlobe(canvasRef.current, {
                devicePixelRatio: 2,
                width: width * 2,
                height: width * 2,
                phi: phiRef.current,
                theta: THETA,
                dark: 0,
                diffuse: 3,
                mapSamples: 16000,
                mapBrightness: 1.5,
                baseColor: [0.99, 0.98, 0.97],
                markerColor: [0.541, 0.482, 0.400],
                glowColor: [0.99, 0.98, 0.97],
                markers,
                onRender: (state) => {
                    if (pointerInteracting.current !== null) {
                        // No auto-rotation during drag
                    } else if (targetPhiRef.current !== null) {
                        const target = targetPhiRef.current;
                        phiRef.current += (target - phiRef.current) * 0.05;
                    }
                    state.phi = phiRef.current;
                    state.width = width * 2;
                    state.height = width * 2;

                    cities.forEach((city, idx) => {
                        const dot = dotRefs.current[idx];
                        if (!dot) return;

                        const proj = projectMarker(
                            city.location[0],
                            city.location[1],
                            phiRef.current,
                            THETA
                        );

                        if (proj.visible) {
                            dot.style.left = `${50 + proj.x * GLOBE_SCALE}%`;
                            dot.style.top = `${50 + proj.y * GLOBE_SCALE}%`;
                            dot.style.opacity = "1";
                        } else {
                            dot.style.opacity = "0";
                        }
                    });
                },
            });
        });

        return () => {
            globe?.destroy();
            if (onResize) window.removeEventListener("resize", onResize);
        };
    }, [selectedCity]);

    // Pointer handlers for click-drag rotation
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        pointerInteracting.current = e.clientX;
        pointerInteractionMovement.current = 0;
        targetPhiRef.current = null;
        setSelectedCity(null);
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    }, []);

    const handlePointerUp = useCallback(() => {
        pointerInteracting.current = null;
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteracting.current = e.clientX;
            pointerInteractionMovement.current += delta;
            phiRef.current += delta / 200;
        }
    }, []);

    return (
        <section
            ref={containerRef}
            id="alpha-campuses"
            className="relative h-screen w-full overflow-hidden bg-[#FDFBF7]"
        >
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-full flex items-center transform-gpu"
            >
                <div className="w-full flex flex-col md:flex-row items-center px-8 md:px-16 gap-12 md:gap-0 pt-48 md:pt-0">

                    {/* Left Column: Copy */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease }}
                        >
                            <span className="font-mono text-xs tracking-widest text-[#8A7B66] uppercase">
                                Proven Nationwide
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1, ease }}
                            className="text-5xl md:text-7xl font-heading font-semibold text-[#2D2C2A] tracking-tight leading-[0.95] mt-6"
                        >
                            Alpha<br />campuses
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease }}
                            className="text-lg md:text-xl font-body font-light text-[#2D2C2A]/60 leading-relaxed max-w-md mt-8"
                        >
                            Already operating in cities like Austin, Miami, New York,
                            and San Francisco. Students consistently demonstrate
                            accelerated academic progress and strong gains in
                            confidence and independence. We&rsquo;re not inventing
                            something new. We&rsquo;re bringing a proven model home.
                        </motion.p>

                        {/* Source Link */}
                        <motion.a
                            href="https://alpha.school"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="inline-flex items-center gap-2 mt-6 text-sm font-mono tracking-wide text-[#8A7B66] hover:text-[#2D2C2A] transition-colors group"
                        >
                            <span>Learn more at alpha.school</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </motion.a>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap gap-3 mt-10"
                        >
                            {cities.map((city, i) => (
                                <button
                                    key={city.name}
                                    onClick={() => handleCityClick(i)}
                                    className={`text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                                        selectedCity === i
                                            ? "bg-[#8A7B66] text-[#FDFBF7] border border-[#8A7B66]"
                                            : "border border-[#2D2C2A]/10 text-[#2D2C2A]/50 hover:border-[#8A7B66]/40 hover:text-[#8A7B66]"
                                    }`}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column: Globe */}
                    <motion.div
                        style={{ opacity: globeOpacity }}
                        className="w-full md:w-1/2 flex items-center justify-center"
                    >
                        <div
                            className="relative w-full max-w-[1000px] aspect-square"
                            style={{ maxHeight: "90vh" }}
                        >
                            <canvas
                                ref={canvasRef}
                                onPointerDown={handlePointerDown}
                                onPointerUp={handlePointerUp}
                                onPointerOut={handlePointerUp}
                                onPointerMove={handlePointerMove}
                                className="w-full h-full cursor-grab"
                                style={{ contain: "layout paint size" }}
                            />

                            {/* Pulsing city marker overlays */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {cities.map((city, i) => (
                                    <div
                                        key={city.name}
                                        ref={(el) => { dotRefs.current[i] = el; }}
                                        className="absolute -translate-x-1/2 -translate-y-1/2"
                                        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#8A7B66] shadow-[0_0_8px_rgba(138,123,102,0.5)] relative">
                                            <div className="absolute -inset-0.5 rounded-full border-2 border-[#8A7B66] animate-marker-pulse" />
                                            <div
                                                className="absolute -inset-0.5 rounded-full border-2 border-[#8A7B66] animate-marker-pulse"
                                                style={{ animationDelay: "1s" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
