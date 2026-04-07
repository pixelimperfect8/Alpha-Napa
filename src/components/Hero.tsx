"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MoveRight } from "lucide-react";

const tickerItems = [
    "2 hours of focused academics.",
    "AI-personalized learning.",
    "Leadership and real-world skills.",
];

export default function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 250]);

    const title = "Alpha School";
    const subtitle = "Napa Valley";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 100 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    // Build the ticker content — repeat items enough times for seamless loop
    const tickerContent = Array(8).fill(tickerItems).flat();

    return (
        <section id="hero" className="relative w-full h-[100svh] flex flex-col justify-center bg-[#131313] text-[#FDFBF7] overflow-hidden rounded-b-[2.5rem]">
            {/* Background Image with parallax + scrim */}
            <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ y }}
                className="absolute inset-0 z-0 transform-gpu"
            >
                <img
                    src="/assets/newhero.webp"
                    alt="Children learning at a vineyard table in Napa Valley"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a08] via-[#0a0a08]/50 to-[#0a0a08]/10 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a08]/40 to-transparent z-10" />
            </motion.div>

            {/* Top Nav Minimal */}
            <div className="absolute top-0 w-full flex justify-between px-8 py-8 z-20 text-xs font-mono tracking-widest uppercase opacity-80">
                <div>{title}</div>
                <div>{subtitle}</div>
            </div>

            {/* Main Content — stacked left-aligned */}
            <div className="relative z-20 w-full px-8 md:px-16">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-[800px] flex flex-col gap-8"
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            variants={item}
                            className="text-[12vw] md:text-[7vw] leading-[0.95] font-heading font-semibold tracking-tight m-0 p-0 pb-[0.15em]"
                        >
                            <span className="text-[#FDFBF7]">Built for the World </span>
                            <span className="text-[#8A7B66]">They&rsquo;re Growing Into.</span>
                        </motion.h1>
                    </div>

                    <motion.p
                        variants={item}
                        className="text-sm md:text-base font-body tracking-wide opacity-80 leading-relaxed font-light max-w-[420px]"
                    >
                        We&rsquo;re assembling 25 founding families for a 2027 launch&mdash;with a <span className="text-white font-medium">permanent $10k annual tuition discount</span>. No commitment to express interest.
                    </motion.p>

                    <motion.div variants={item} className="flex">
                        <a
                            href="#community"
                            onClick={(e) => {
                                e.preventDefault();
                                const lenis = (window as any).__lenis;
                                if (lenis) {
                                    lenis.scrollTo("#community");
                                } else {
                                    document.getElementById("community")?.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            data-track="cta_click"
                            className="group w-full md:w-auto inline-flex items-center justify-between px-6 py-4 rounded-none bg-[#8A7B66] text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#1c1b19] transition-all gap-8"
                        >
                            <span className="text-sm font-heading tracking-wide uppercase">Join Founders List</span>
                            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Ticker Strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-[40px] left-0 right-0 z-20 overflow-hidden"
            >
                <div className="flex items-center animate-ticker">
                    {tickerContent.map((text, i) => (
                        <span
                            key={i}
                            className="shrink-0 flex items-center whitespace-nowrap py-3"
                        >
                            <span className="text-xs font-mono tracking-widest uppercase text-[#FDFBF7]/60 px-[12px]">{text}</span>
                            <span className="text-[#8A7B66]/40 px-[12px]">&bull;</span>
                        </span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
