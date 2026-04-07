"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function StepBlock({
    step,
    scrollYProgress,
    inStart,
    inEnd,
    outStart,
    outEnd,
}: {
    step: { num: string; title: string; desc: string };
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    inStart: number;
    inEnd: number;
    outStart: number | null;
    outEnd: number | null;
}) {
    const opacity = useTransform(
        scrollYProgress,
        outStart !== null && outEnd !== null
            ? [inStart, inEnd, outStart, outEnd]
            : [inStart, inEnd],
        outStart !== null && outEnd !== null ? [0, 1, 1, 0] : [0, 1]
    );
    const y = useTransform(
        scrollYProgress,
        outStart !== null && outEnd !== null
            ? [inStart, inEnd, outStart, outEnd]
            : [inStart, inEnd],
        outStart !== null && outEnd !== null ? [50, 0, 0, -50] : [50, 0]
    );

    return (
        <motion.div
            style={{ opacity, y }}
            className="absolute inset-0 flex flex-col justify-center"
        >
            <div className="font-mono text-sm text-[#8A7B66] mb-4 tracking-widest">
                [{step.num}]
            </div>
            <h3 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight text-white mb-6">
                {step.title}
            </h3>
            <p className="text-lg md:text-xl text-white/50 font-body font-light leading-relaxed max-w-md">
                {step.desc}
            </p>
        </motion.div>
    );
}

export default function StickyScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const steps = [
        {
            num: "S",
            title: "Same pace.",
            desc: "Most schools still follow a structure designed over 100 years ago.",
        },
        {
            num: "S",
            title: "Same schedule.",
            desc: "Dictated by bells and arbitrary time blocks rather than engagement.",
        },
        {
            num: "S",
            title: "Same system.",
            desc: "A singular approach applied to uniquely different minds.",
        },
        {
            num: "01",
            title: "AI Exists.",
            desc: "Information is ubiquitous. We must teach judgment, not memorization.",
        },
    ];

    // 4 steps, each gets fade-in (1 unit) + fade-out (1 unit) except last
    // Total: 7 units across 0-1 progress
    const unit = 1 / 7;

    return (
        <section id="the-problem" ref={containerRef} className="relative w-full h-[400vh] bg-[#1c1b19]">
            <div className="sticky top-0 h-screen w-full flex pt-32 pb-16">
                {/* Section eyebrow */}
                <div className="absolute top-8 left-0 z-10 w-full px-8 md:px-16">
                    <span className="font-mono text-xs tracking-widest text-[#8A7B66] uppercase">
                        The Problem
                    </span>
                </div>

                <div className="container mx-auto px-8 md:px-16 flex flex-col md:flex-row h-full">
                    {/* Left: Typographic anchor */}
                    <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8A7B66]/20 to-transparent opacity-50 blur-3xl rounded-full scale-75" />
                        <h2 className="text-[clamp(3rem,8vw,6rem)] font-heading font-semibold tracking-tight leading-[0.95] text-white z-10 text-left">
                            Should School<br />Look Different?
                        </h2>
                    </div>

                    {/* Right: Scrubbing Text */}
                    <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-0 md:px-16 relative">
                        <div className="relative h-2/3 w-full">
                            {steps.map((step, i) => {
                                const isLast = i === steps.length - 1;
                                return (
                                    <StepBlock
                                        key={i}
                                        step={step}
                                        scrollYProgress={scrollYProgress}
                                        inStart={i * 2 * unit}
                                        inEnd={(i * 2 + 1) * unit}
                                        outStart={isLast ? null : (i * 2 + 1) * unit}
                                        outEnd={isLast ? null : (i * 2 + 2) * unit}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
