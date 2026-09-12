"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MoveRight } from "lucide-react";

const tickerItems = [
    "2 hours of focused academics.",
    "AI-personalized learning.",
    "Leadership and real-world skills.",
];

// Podcasts featured in the floating card. The first entry shows by default
// and the card auto-cycles through them.
const podcasts = [
    {
        url: "https://www.hubermanlab.com/episode/how-to-accelerate-learning-and-improve-education-joe-liemandt",
        image: "https://cdn.prod.website-files.com/64751ad903a904b42aa4adc1/6a94e52d60d2c065fd146252_SITE_JL_L1190680.webp",
        alt: "Huberman Lab podcast",
        title: "How to Accelerate Learning & Improve Education",
        show: "Huberman Lab · Joe Liemandt",
    },
    {
        url: "https://podcasts.apple.com/us/podcast/invest-like-the-best-with-patrick-oshaughnessy/id1154105909?i=1000723564395",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/61/ae/be/61aebe7a-06e8-7390-3ae5-f2fc5889e36c/mza_10827489189939068066.jpg/600x600bb.jpg",
        alt: "Invest Like the Best podcast",
        title: "Building Alpha School & The Future of Education",
        show: "Invest Like the Best · Joe Liemandt",
    },
];

// How long each podcast stays visible before advancing (ms).
const PODCAST_ROTATE_MS = 15000;

export default function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 250]);

    // Podcast carousel: starts on the first entry and advances on a timer.
    // The timer resets whenever `activePodcast` changes, so manual dot clicks
    // also restart the countdown.
    const [activePodcast, setActivePodcast] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setActivePodcast((prev) => (prev + 1) % podcasts.length);
        }, PODCAST_ROTATE_MS);
        return () => clearInterval(id);
    }, [activePodcast]);
    const podcast = podcasts[activePodcast];

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

            {/* Main Content */}
            {/* Mobile: nudge the block up (mb pushes it up within the centered flex) to clear the full-width podcast card. */}
            <div className="relative z-20 w-full px-8 md:px-16 mb-48 md:mb-0">
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
                        A group of Napa Valley families are exploring bringing Alpha School to our community in 2027. We&rsquo;re gathering interest&mdash;join us.
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
                            <span className="text-sm font-heading tracking-wide uppercase">Learn More</span>
                            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Podcast Card (auto-rotating carousel) */}
            {/* Mobile: full-width above the ticker. Desktop: floating bottom-right, scaled 20%. */}
            <div className="absolute bottom-28 left-4 right-4 md:left-auto md:right-16 z-30 md:scale-[1.2] md:origin-bottom-right">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3 w-full md:w-[320px]"
            >
                <a
                    href={podcast.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePodcast}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/15 transition-colors duration-300 shadow-2xl"
                        >
                            <img
                                src={podcast.image}
                                alt={podcast.alt}
                                className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A7B66]">
                                    Podcast
                                </span>
                                <span className="text-sm font-heading font-medium text-[#FDFBF7] leading-tight line-clamp-2">
                                    {podcast.title}
                                </span>
                                <span className="text-[11px] font-body text-white/40 truncate">
                                    {podcast.show}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#8A7B66] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#FDFBF7] ml-0.5">
                                    <polygon points="6,4 20,12 6,20" />
                                </svg>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </a>

                {/* Navigation dots */}
                <div className="flex items-center justify-center gap-2">
                    {podcasts.map((p, i) => (
                        <button
                            key={p.url}
                            type="button"
                            onClick={() => setActivePodcast(i)}
                            aria-label={`Show podcast ${i + 1}: ${p.title}`}
                            aria-current={i === activePodcast}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === activePodcast
                                    ? "w-6 bg-[#8A7B66]"
                                    : "w-1.5 bg-white/30 hover:bg-white/50"
                            }`}
                        />
                    ))}
                </div>
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
