"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

export default function SplitScreen() {
    const [familyName, setFamilyName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const benefits = [
        { title: "Founding Family Pricing", detail: "Locked in deeply discounted tuition rates for the duration of enrollment." },
        { title: "Direct Input", detail: "Seat at the table for developing electives, out-of-school quests, and community norms." },
        { title: "Early Access", detail: "Priority enrollment for siblings and exclusive access to parent workshops." },
        { title: "Beta Testing", detail: "First to trial new AI tools, curriculum modules, and scheduling prototypes." },
    ];

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ family_name: familyName, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
        } catch (err) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
        }
    }

    return (
        <section className="w-full flex flex-col md:flex-row min-h-screen bg-[#1c1b19] text-[#FDFBF7] rounded-b-[2.5rem]" id="community">
            {/* Left Column */}
            <div className="w-full md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 p-8 md:p-16 relative overflow-hidden group">
                <div className="relative z-10">
                    <h2 className="text-sm font-mono tracking-widest text-[#8A7B66] mb-8 uppercase">Join the Vision</h2>
                    <h3 className="text-4xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] max-w-sm">
                        We are looking for{" "}
                        <span className="text-[#8A7B66] italic">co-creators</span>.
                    </h3>
                </div>

                <div className="relative z-10 mt-16 md:mt-0">
                    <p className="text-lg font-body font-light leading-relaxed max-w-sm opacity-80">
                        Alpha Napa is starting with an intimate cohort of Founding Families who share our belief that education needs a systemic upgrade. Expressing interest is completely non-binding&mdash;we&rsquo;re simply gathering aligned families.
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center">

                <div className="mb-16">
                    <div className="flex items-baseline gap-4 mb-8">
                        <h3 className="text-6xl md:text-8xl font-heading text-[#8A7B66] leading-none">$20k</h3>
                        <span className="text-[0.65rem] md:text-sm font-mono tracking-widest uppercase opacity-50 border border-white/20 px-3 md:px-4 py-2 rounded-full">Founding Rate</span>
                    </div>
                    <p className="text-white/60 font-body font-light leading-relaxed">
                        Standard tuition will be $30k/year upon full launch. Founding Families receive a <span className="text-white font-medium">permanent $10,000 annual discount</span> per child.
                    </p>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <h4 className="font-heading font-medium text-xl mb-6">Founding Benefits</h4>
                    <div className="flex flex-col gap-6">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="mt-1">
                                    <ArrowUpRight className="w-5 h-5 text-[#8A7B66]" />
                                </div>
                                <div>
                                    <h5 className="font-heading font-medium text-lg mb-1">{b.title}</h5>
                                    <p className="font-body text-sm font-light opacity-60 leading-relaxed">{b.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="mt-16 bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8A7B66]/0 via-[#8A7B66]/10 to-[#8A7B66]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 flex flex-col items-center justify-center py-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#8A7B66]/20 flex items-center justify-center mb-6">
                                <Check className="w-8 h-8 text-[#8A7B66]" />
                            </div>
                            <h4 className="font-heading font-medium text-2xl mb-2">You&rsquo;re on the list.</h4>
                            <p className="text-white/50 font-body font-light">We&rsquo;ll be in touch soon with next steps.</p>
                        </motion.div>
                    ) : (
                        <>
                            <h4 className="font-heading font-medium text-2xl mb-6 relative z-10">Request Information</h4>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                                <input
                                    type="text"
                                    placeholder="Family Name"
                                    value={familyName}
                                    onChange={(e) => setFamilyName(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 focus:outline-none focus:border-[#8A7B66] transition-colors font-body text-sm"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 focus:outline-none focus:border-[#8A7B66] transition-colors font-body text-sm"
                                />
                                {status === "error" && (
                                    <p className="text-red-400 text-sm font-body">{errorMessage}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="mt-4 bg-[#8A7B66] text-[#FDFBF7] font-heading tracking-wide uppercase px-6 py-4 rounded-none hover:bg-[#FDFBF7] hover:text-[#1c1b19] transition-colors flex justify-between items-center disabled:opacity-50"
                                >
                                    <span>{status === "loading" ? "Submitting..." : "Submit Interest"}</span>
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    )}
                </div>

            </div>
        </section>
    );
}
