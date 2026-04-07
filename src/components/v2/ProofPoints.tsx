"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
    { value: "11", label: "Campuses Operating" },
    { value: "22", label: "Opening Fall 2026" },
    { value: "2x", label: "Faster Learning" },
    { value: "90%+", label: "Mastery Before Advancing" },
];

const press = [
    { name: "The New York Times", logo: "/press/nyt.webp" },
    { name: "Forbes", logo: "/press/forbes.webp" },
    { name: "Wall Street Journal", logo: "/press/wsj.webp" },
    { name: "Today Show", logo: "/press/today-show.webp" },
    { name: "Business Insider", logo: "/press/business-insider.webp" },
    { name: "USA Today", logo: "/press/usa-today.webp" },
    { name: "Fox News", logo: "/press/fox-news.webp" },
    { name: "Washington Times", logo: "/press/washington-times.webp" },
];

const resources = [
    { label: "Alpha School Website", href: "https://alpha.school" },
    { label: "How 2-Hour Learning Works (Video)", href: "https://youtu.be/ENdAWT6N0V4" },
];

const tickerContent = Array(6).fill(press).flat();

function VideoCard() {
    const [playing, setPlaying] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="relative bg-[#1c1b19] rounded-2xl overflow-hidden aspect-video"
        >
            {playing ? (
                <iframe
                    src="https://www.youtube.com/embed/ENdAWT6N0V4?autoplay=1&rel=0"
                    title="2-Hour Learning: How It Works"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            ) : (
                <button
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
                >
                    {/* YouTube thumbnail */}
                    <img
                        src="https://img.youtube.com/vi/ENdAWT6N0V4/maxresdefault.jpg"
                        alt="2-Hour Learning video thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1c1b19]/60 to-transparent" />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#8A7B66] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-[#FDFBF7] ml-0.5" fill="currentColor" />
                        </div>
                        <span className="text-[#FDFBF7] font-heading font-medium text-lg text-center px-4">
                            2-Hour Learning: How It Works
                        </span>
                        <span className="text-[#FDFBF7]/40 font-mono text-xs uppercase tracking-widest">
                            Watch on YouTube
                        </span>
                    </div>
                </button>
            )}
        </motion.div>
    );
}

export default function ProofPoints() {
    return (
        <section className="w-full bg-[#F5F1EB] overflow-hidden" id="proof">
            <div className="container mx-auto px-8 md:px-16 py-32">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease }}
                >
                    <span className="font-mono text-xs tracking-widest text-[#8A7B66] uppercase">
                        Why Alpha
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
                    A Proven Model.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15, ease }}
                    className="text-lg md:text-xl font-body font-light text-[#2D2C2A]/60 leading-relaxed max-w-2xl mt-8"
                >
                    Alpha School isn&rsquo;t a concept&mdash;it&rsquo;s a network of campuses where students already learn differently. Here&rsquo;s what backs it up.
                </motion.p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: idx * 0.08, ease }}
                            className="border-t border-[#2D2C2A]/10 pt-8"
                        >
                            <div className="text-4xl md:text-6xl font-heading font-semibold text-[#2D2C2A] tracking-tight leading-none">
                                {stat.value}
                            </div>
                            <div className="text-sm font-body font-light text-[#2D2C2A]/50 mt-3">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Press Mentions — Ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease }}
                    className="mt-20 md:mt-28"
                >
                    <h3 className="font-mono text-xs tracking-widest text-[#8A7B66] uppercase mb-8 px-0">
                        Featured In
                    </h3>
                </motion.div>
                <div className="relative -mx-8 md:-mx-16 overflow-hidden">
                    {/* Fade edges */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#F5F1EB] to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#F5F1EB] to-transparent" />
                    <div className="flex items-center animate-ticker-press">
                        {tickerContent.map((item, i) => (
                            <span
                                key={i}
                                className="shrink-0 flex items-center py-4 px-8 md:px-10"
                            >
                                <img
                                    src={item.logo}
                                    alt={item.name}
                                    className="h-12 md:h-16 w-auto object-contain"
                                    style={{ filter: "brightness(0) opacity(0.45)" }}
                                />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Video + Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 md:mt-28">
                    {/* Video Card — click to play inline */}
                    <VideoCard />

                    {/* Resources List */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1, ease }}
                        className="flex flex-col justify-center gap-6"
                    >
                        <h3 className="font-mono text-xs tracking-widest text-[#8A7B66] uppercase mb-2">
                            Learn More
                        </h3>
                        {resources.map((res, idx) => (
                            <a
                                key={idx}
                                href={res.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between border-b border-[#2D2C2A]/10 pb-6 hover:border-[#8A7B66]/30 transition-colors"
                            >
                                <span className="text-xl md:text-2xl font-heading font-medium text-[#2D2C2A] group-hover:text-[#8A7B66] transition-colors duration-300">
                                    {res.label}
                                </span>
                                <ExternalLink className="w-5 h-5 text-[#2D2C2A]/30 group-hover:text-[#8A7B66] transition-colors duration-300 shrink-0 ml-4" />
                            </a>
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
