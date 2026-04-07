"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
    {
        num: "01",
        title: "Founders",
        desc: "Assemble 25 founding families who would seriously consider enrolling.",
    },
    {
        num: "02",
        title: "Location",
        desc: "Secure the right location — ~3,000 sq ft with room to grow.",
    },
    {
        num: "03",
        title: "Experience",
        desc: "Host local meetups and an Alpha Experience Day.",
    },
];

export default function BentoGrid() {
    return (
        <section className="w-full bg-[#FDFBF7] overflow-hidden" id="what-alpha-looks-like">
            <div className="container mx-auto px-8 md:px-16 py-32">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease }}
                >
                    <span className="font-mono text-xs tracking-widest text-[#8A7B66] uppercase">
                        The Process
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease }}
                    className="text-5xl md:text-7xl font-heading font-semibold text-[#2D2C2A] tracking-tight leading-[0.95] mt-6"
                >
                    How We&rsquo;re Getting<br />Started.
                </motion.h2>

                {/* Steps */}
                <div className="mt-16 md:mt-24">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: idx * 0.08, ease }}
                            className="group border-t border-[#2D2C2A]/10 py-10 md:py-14"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
                                <span className="font-mono text-xs tracking-widest text-[#8A7B66]/50 md:w-16 shrink-0 md:pt-2">
                                    {step.num}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-heading font-semibold text-[#2D2C2A] tracking-tight leading-[1.1] md:w-1/2 shrink-0 group-hover:text-[#8A7B66] transition-colors duration-500">
                                    {step.title}
                                </h3>
                                <p className="text-[#2D2C2A]/50 font-body font-light leading-relaxed md:max-w-sm md:ml-auto">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Closing line */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease }}
                    className="text-base md:text-lg font-body font-light text-[#2D2C2A]/50 leading-relaxed max-w-2xl mt-16 md:mt-20"
                >
                    If those pieces align, enrollment opens.<br />
                    We won&rsquo;t launch without the right foundation in place.
                </motion.p>
            </div>
        </section>
    );
}
