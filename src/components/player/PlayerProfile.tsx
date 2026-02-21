"use client";

import { Player, GameMode } from "@/types";
import { TierBadge } from "@/components/ui/TierBadge";
import { getFullSkinRenderUrl } from "@/utils/mojang-api";
import { motion } from "framer-motion";
import { Trophy, Zap, ShieldCheck, History, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PlayerProfileProps {
    player: Player;
}

import { Tier } from "@/components/ui/TierBadge";

const gameModes: GameMode[] = ['Vanilla', 'Diamond SMP', 'SMP', 'Pot', 'Sword', 'UHC', 'Speed', 'NethOP'];

const TIER_ORDER: Record<string, number> = {
    'HT1': 0, 'LT1': 1,
    'HT2': 2, 'LT2': 3,
    'HT3': 4, 'LT3': 5,
    'HT4': 6, 'LT4': 7,
    'HT5': 8, 'LT5': 9,
};

export function PlayerProfile({ player }: PlayerProfileProps) {
    const sortedModes = [...gameModes].sort((a, b) => {
        const tierA = player.tiers[a];
        const tierB = player.tiers[b];

        // Handle Unranked (push to very end)
        if (!tierA && !tierB) return 0;
        if (!tierA) return 1;
        if (!tierB) return -1;

        // Rule: Retired tiers always after active tiers
        if (tierA.retired !== tierB.retired) {
            return tierA.retired ? 1 : -1;
        }

        // Rule: Sort by rank within visibility group (HT1 < LT1)
        const orderA = TIER_ORDER[tierA.current as string] ?? 99;
        const orderB = TIER_ORDER[tierB.current as string] ?? 99;

        return orderA - orderB;
    });
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Back Button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 font-bold group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Rankings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Big Skin Render */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-4 flex flex-col items-center sticky top-24"
                >
                    <div className="relative group">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse" />

                        <img
                            src={getFullSkinRenderUrl(player.uuid)}
                            alt={player.username}
                            className="w-full max-w-[320px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2"
                        />
                    </div>

                    <div className="text-center mt-8">
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                            {player.username}
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <span className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-black text-sm tracking-widest uppercase italic border-2 border-amber-500 shadow-xl shadow-amber-400/20">
                                {(player.totalPoints || 0) > 400 ? 'Overall Champion' : 'Elite Competitor'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-12">
                        <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-3xl text-center">
                            <div className="text-3xl font-black text-white">{player.totalPoints}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Points</div>
                        </div>
                        <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-3xl text-center">
                            <div className="text-3xl font-black text-white">#1</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Server Rank</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Tiers and Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-8 space-y-8"
                >
                    {/* Tiers Section */}
                    <section className="bg-zinc-900/20 border border-white/[0.03] rounded-[40px] p-8 lg:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Trophy className="w-32 h-32 text-white" />
                        </div>

                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight">Gamemode Mastery</h2>
                                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Active Tier Distribution</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-white/5 rounded-[32px] p-2 bg-black/20">
                            {[0, 1].map((colIdx) => {
                                const mid = Math.ceil(sortedModes.length / 2);
                                const modes = colIdx === 0
                                    ? sortedModes.slice(0, mid)
                                    : sortedModes.slice(mid);

                                return (
                                    <div key={colIdx} className="flex flex-col gap-3">
                                        {modes.map((mode) => {
                                            const tier = player.tiers[mode];
                                            return (
                                                <div
                                                    key={mode}
                                                    className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/40 border border-white/5 group hover:border-primary/20 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-1.5 h-8 bg-zinc-800 rounded-full group-hover:bg-primary transition-colors" />
                                                        <div>
                                                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{mode}</div>
                                                            {tier ? (
                                                                <div className="flex items-center gap-2">
                                                                    <TierBadge tier={tier.current} retired={tier.retired} size="md" className="px-3 py-0.5 font-black italic shadow-lg" />
                                                                    {tier.retired && (
                                                                        <span className="text-[8px] font-black text-zinc-600 uppercase border border-zinc-700/50 px-1.5 rounded-sm">Legacy</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">Unranked</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {tier?.peak && tier.peak !== tier.current && !tier.retired && (
                                                        <div className="text-right flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                                                            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Peak</div>
                                                            <TierBadge tier={tier.peak} size="sm" className="scale-75 origin-right grayscale" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* History / Badges Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/20 border border-white/[0.03] rounded-[40px] p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <History className="w-5 h-5 text-zinc-500" />
                                <h3 className="text-xl font-black text-white">Player Status</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
                                    <span className="text-zinc-400 font-bold">Verification</span>
                                    <span className="text-green-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
                                    <span className="text-zinc-400 font-bold">Member Since</span>
                                    <span className="text-white font-black">FEB 2024</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[40px] p-8 flex flex-col justify-center">
                            <Zap className="w-10 h-10 text-primary mb-4" fill="currentColor" />
                            <h3 className="text-2xl font-black text-white mb-2">IsraelPVP Legend</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                Legendary status is awarded to players who have held multiple HT1 titles or consistently placed in the Top 3 for over 6 months.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
