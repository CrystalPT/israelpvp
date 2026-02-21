"use client";

import { useState, useEffect } from "react";
import { Punishment } from "@/types";
import { getPunishments } from "@/lib/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { PunishmentCard } from "@/components/punishments/PunishmentCard";
import { ShieldAlert, Gavel } from "lucide-react";
import { motion } from "framer-motion";

export default function PunishmentsPage() {
    const [punishments, setPunishments] = useState<Punishment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPunishments();
                setPunishments(data);
            } catch (error) {
                console.error("Error fetching punishments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="min-h-screen pt-32 pb-24">
            <Navbar />
            <div className="container mx-auto px-4">
                <div className="mb-20 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/10 blur-[100px] -z-10" />
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest mb-6"
                    >
                        <Gavel className="w-4 h-4" />
                        Live Enforcement
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic">
                        Punish<span className="text-red-500">ments</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl mx-auto font-bold text-lg leading-relaxed">
                        Maintaining a fair environment on IsraelPVP. All recorded infractions are listed here with verifiable evidence.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-32 bg-zinc-900/20 rounded-[40px] border border-white/[0.03]">
                            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6" />
                            <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Fetching Enforcement Logs...</p>
                        </div>
                    ) : punishments.length > 0 ? (
                        punishments.map((punishment, index) => (
                            <motion.div
                                key={punishment.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <PunishmentCard punishment={punishment} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center p-32 bg-zinc-900/20 rounded-[40px] border border-white/[0.03] text-center">
                            <ShieldAlert className="w-20 h-20 text-zinc-800 mb-8" />
                            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">All Clear</h2>
                            <p className="text-zinc-500 font-bold max-w-xs">No active punishments found in our records. Keep it up!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
