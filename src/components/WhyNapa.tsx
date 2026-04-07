"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WhyNapa() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within the section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Box grows from invisible speck to full-bleed
    const scale = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);
    const borderRadius = useTransform(scrollYProgress, [0.1, 0.55], ["2.5rem", "0rem"]);

    // Overlay text fades in after the image is large
    const textOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.55, 0.72], [40, 0]);

    return (
        <section ref={containerRef} className="relative z-10 h-[280vh] bg-[#FDFBF7]" id="why-napa">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Section eyebrow */}
                <div className="absolute top-8 left-0 z-[5] px-8 md:px-16">
                    <span className="font-mono text-xs tracking-widest text-[#FDFBF7] uppercase">
                        The Setting
                    </span>
                </div>

                {/* Ghost watermark — Title Case, no uppercase */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 className="text-[25vw] font-heading text-[#2D2C2A] opacity-5 font-bold tracking-tighter leading-none whitespace-nowrap">
                        Why Napa
                    </h2>
                </div>

                {/* Expanding Image Window: starts at scale 0 + opacity 0 */}
                <motion.div
                    style={{ scale, opacity, borderRadius }}
                    className="relative w-full h-screen overflow-hidden transform-gpu flex items-center justify-center shadow-2xl bg-[#2D2C2A]"
                >
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10" />

                    {/* Vineyard background image */}
                    <img
                        src="/assets/whynapa.webp"
                        alt="Napa Valley vineyards at golden hour"
                        className="absolute inset-0 w-full h-full object-cover scale-105"
                    />

                    {/* Overlay text fades in at the end of the scale animation */}
                    <motion.div
                        style={{ opacity: textOpacity, y: textY }}
                        className="relative z-20 text-center px-8 md:px-0 max-w-4xl flex flex-col items-center"
                    >
                        <h3 className="text-4xl md:text-7xl font-heading font-semibold text-[#FDFBF7] mb-8 leading-[1.1] tracking-tight">
                            Why we&rsquo;re bringing<br />this to Napa
                        </h3>
                        <p className="text-base md:text-xl font-body font-light text-[#FDFBF7]/75 leading-relaxed max-w-2xl">
                            We live here. Our kids are growing up here. If we believe in this model, the next step is simple: bring it home. If this launches, our children will be in the first cohort. That&rsquo;s our alignment.
                        </p>
                        <p className="text-sm md:text-base font-body text-[#FDFBF7]/50 mt-4 tracking-wide">
                            &mdash; Founding Families
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
