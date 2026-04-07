"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function FooterParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress purely over this component's height
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Parallax the inner element strongly from top down
    const y = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

    return (
        <section
            ref={containerRef}
            id="footer"
            className="relative h-screen w-full overflow-hidden bg-[#131313]"
        >
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center transform-gpu"
            >
                <div className="absolute inset-0 bg-[#1c1b19]/50 z-10" />
                <img
                    src="/assets/footershot.webp"
                    alt="Alpha Napa"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                {/* Massive Brand Typography */}
                <h1 className="relative z-20 text-[18vw] text-center w-full font-heading font-semibold tracking-tight text-[#FDFBF7] leading-[0.85] opacity-90 drop-shadow-2xl">
                    Alpha<br />Napa
                </h1>

                <div className="absolute bottom-16 z-30 flex gap-8 font-mono text-xs uppercase tracking-widest text-white/50">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                    <a href="#" className="hover:text-white transition-colors">Careers</a>
                </div>
            </motion.div>
        </section>
    );
}
