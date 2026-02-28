"use client";

import { useState, useEffect, useMemo } from "react";
import { Player, Tier, GameMode } from "@/types";
import { getPlayers } from "@/lib/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { TierBadge } from "@/components/ui/TierBadge";
import { getPlayerSkinUrl } from "@/utils/mojang-api";
import Link from "next/link";
import { ChevronLeft, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import { use } from "react";

const RISING_TIERS: Tier[] = ['LT3', 'HT4', 'LT4', 'HT5', 'LT5'];

interface TierPageProps {
    params: Promise<{ mode: string; tier: string }>;
}

export default function TierPage({ params }: TierPageProps) {
    const { mode: modeParam, tier: tierParam } = use(params);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    const decodedMode = modeParam.replace(/-/g, ' ') as GameMode;
    const isRising = tierParam === "Rising";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPlayers();
                setPlayers(data);
            } catch (error) {
                console.error("Error fetching players:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            const tierData = p.tiers[decodedMode];
            if (!tierData || tierData.retired) return false;

            if (isRising) {
                return RISING_TIERS.includes(tierData.current as Tier);
            }
            return tierData.current === tierParam;
        }).sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    }, [players, decodedMode, tierParam, isRising]);

    return (
        <main className="min-h-screen pt-32 pb-24 relative bg-dot-pattern">
            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[150px] animate-pulse" />
            </div>

            <Navbar />

            <div className="container mx-auto px-4 max-w-7xl relative">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Rankings
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                {isRising ? (
                                    <Users className="w-6 h-6 text-zinc-600" />
                                ) : (
                                    <Trophy className="w-6 h-6 text-primary" />
                                )}
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                    {isRising ? "Rising Ranks" : `${tierParam} Tier`}
                                </h1>
                            </div>
                            <p className="text-zinc-500 font-bold text-xl uppercase tracking-widest italic">
                                {decodedMode} Roster
                            </p>
                        </div>
                        <div className="glass-premium px-8 py-4 rounded-3xl border-white/5">
                            <span className="text-zinc-600 font-black uppercase tracking-widest text-[10px] block mb-1">Total Players</span>
                            <span className="text-3xl font-black text-white">{filteredPlayers.length}</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-40 bg-zinc-900/20 rounded-[60px] border border-white/[0.03]">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                        <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Loading Roster...</p>
                    </div>
                ) : filteredPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPlayers.map((player, idx) => (
                            <motion.div
                                key={player.uuid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link
                                    href={`/player/${player.uuid}`}
                                    className="glass-premium p-6 rounded-[32px] flex items-center justify-between group hover:border-primary/40 transition-all border border-white/5 hover:bg-white/[0.02]"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getPlayerSkinUrl(player.uuid)}
                                            className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 shadow-md transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 shrink-0"
                                        />
                                        <div className="flex flex-col min-w-0 pr-4">
                                            <span className="font-black text-white group-hover:text-primary transition-colors text-lg tracking-tight truncate">
                                                {player.username}
                                            </span>
                                            <div className="mt-1 flex items-center gap-2">
                                                <TierBadge
                                                    tier={player.tiers[decodedMode].current as Tier}
                                                    size="sm"
                                                    className="opacity-90 scale-90 origin-left"
                                                />
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase">
                                                    {player.totalPoints} PTS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-32 bg-zinc-900/20 rounded-[60px] border border-white/[0.03]">
                        <Trophy className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Level Empty</h2>
                        <p className="text-zinc-500 font-bold max-w-xs mx-auto">No players currently tested for this tier division.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
