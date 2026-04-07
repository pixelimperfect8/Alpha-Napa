"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const traits = [
    { num: "01", title: "Mastery Based", desc: "Families seeking an approach grounded in mastery rather than age." },
    { num: "02", title: "High Agency", desc: "Students who thrive on independence and are eager to direct their own learning." },
    { num: "03", title: "Real Skills", desc: "Those who value real-world projects and hands-on learning alongside academics." },
    { num: "04", title: "Intentional", desc: "Learners seeking a highly intentional, closely-knit community of driven peers." }
];

export default function WhoThisIsFor() {
    const targetRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({ target: targetRef });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-[#1c1b19] text-[#FDFBF7]" id="who-this-is-for">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                <div className="absolute top-16 left-0 z-10 w-full flex justify-between px-8 md:px-16 text-xs font-mono uppercase tracking-widest text-[#8A7B66]">
                    <span>Who This Is For.</span>
                    <span className="opacity-50">The Alpha Profile</span>
                </div>

                <motion.div style={{ x }} className="flex w-[400vw] h-full items-center">
                    {traits.map((trait, index) => (
                        <div key={index} className="w-[100vw] h-full flex flex-col justify-center px-8 md:px-32 relative">

                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden select-none">
                                <span className="text-[60vw] font-heading font-medium leading-none">{trait.num}</span>
                            </div>

                            <div className="relative z-10 max-w-4xl border-l border-[#8A7B66]/30 pl-8 md:pl-16">
                                <div className="font-mono text-xs uppercase tracking-widest text-[#8A7B66] mb-8">
                                    Trait {trait.num}
                                </div>
                                <h2 className="text-[clamp(4rem,7vw,9rem)] font-heading font-semibold leading-[0.95] text-[#FDFBF7] mb-12 tracking-tight">
                                    {trait.title}.
                                </h2>
                                <p className="text-xl md:text-3xl font-body font-light text-[#FDFBF7]/60 max-w-2xl leading-relaxed">
                                    {trait.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
