"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const resourceLinks = [
    { label: "alpha.school", href: "https://alpha.school" },
    { label: "YouTube", href: "https://www.youtube.com/@thealphaschool" },
    { label: "Instagram", href: "https://www.instagram.com/alphaschool_2hrlearning" },
];

export default function FooterParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

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

                {/* Resource Links */}
                <div className="absolute bottom-28 z-30 flex flex-wrap justify-center gap-6 px-8">
                    {resourceLinks.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[#8A7B66] hover:text-white transition-colors"
                        >
                            <span>{link.label}</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
