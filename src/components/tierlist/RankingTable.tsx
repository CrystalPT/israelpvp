"use client";

import { useState, useMemo } from "react";
import { Player, GameMode } from "@/types";
import { ModeTabs } from "@/components/ui/ModeTabs";
import { getPlayerSkinUrl, getFullSkinRenderUrl } from "@/utils/mojang-api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TierBadge, Tier, TIER_NAMES } from "@/components/ui/TierBadge";
import { Trophy, Star, Crown, Users, Search } from "lucide-react";
import { cn } from "@/utils/cn";

const TIER_ORDER: Record<string, number> = {
    'HT1': 0, 'LT1': 1,
    'HT2': 2, 'LT2': 3,
    'HT3': 4, 'LT3': 5,
    'HT4': 6, 'LT4': 7,
    'HT5': 8, 'LT5': 9,
};

interface RankingTableProps {
    players: Player[];
}

const TIER_GROUPS: Tier[] = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5'];

export function RankingTable({ players }: RankingTableProps) {
    const [selectedMode, setSelectedMode] = useState<GameMode>('Overall');
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPlayers = useMemo(() => {
        if (!searchQuery.trim()) return players;
        const query = searchQuery.toLowerCase();
        return players.filter(p =>
            p.username.toLowerCase().includes(query) ||
            p.uuid.toLowerCase().includes(query)
        );
    }, [players, searchQuery]);

    const groupedPlayers = useMemo(() => {
        const groups: Record<string, Player[]> = {};
        TIER_GROUPS.forEach(t => groups[t] = []);

        filteredPlayers.forEach(p => {
            const tierData = p.tiers[selectedMode];
            const tier = tierData?.current;

            // Rule: Retired players only show in Overall view
            if (selectedMode !== 'Overall' && tierData?.retired) {
                return;
            }

            if (tier && groups[tier]) {
                groups[tier].push(p);
            }
        });

        // Ensure each group is sorted by points internally
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
        });

        return groups;
    }, [filteredPlayers, selectedMode]);

    const sortedOverallPlayers = useMemo(() => {
        return [...players].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    }, [players]);

    const getPlayerGlobalRank = (uuid: string) => {
        return sortedOverallPlayers.findIndex(p => p.uuid === uuid) + 1;
    };

    return (
        <div className="space-y-16">
            {/* Search and Filter Bar */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                    <ModeTabs selected={selectedMode} onSelect={setSelectedMode} />

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find username or UUID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/40 focus:bg-zinc-900/60 transition-all font-bold text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Unique Bento Layout */}
            <div className="max-w-7xl mx-auto space-y-12">
                {!searchQuery.trim() ? (
                    <>
                        {/* TOP SECTION: God Tier (HT1) / Overall Top Spotlight */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 px-4">
                                <Crown className="w-5 h-5 text-amber-400" />
                                <h2 className="text-xl font-black text-white uppercase tracking-widest italic">
                                    {selectedMode === 'Overall' ? 'Server Legends' : 'High Tier 1: The Elite'}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {/* God Tier Spotlight / Overall Top 3 Podium */}
                                {(() => {
                                    const championCandidates = selectedMode === 'Overall'
                                        ? [...filteredPlayers].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
                                        : groupedPlayers['HT1'];

                                    const champion = championCandidates[0];

                                    if (!champion) return (
                                        <div className="p-12 text-center border border-dashed border-white/5 rounded-[40px] bg-black/20">
                                            <p className="text-zinc-500 font-bold uppercase tracking-widest">
                                                No {selectedMode === 'Overall' ? 'players' : 'HT1 player'} currently recorded
                                            </p>
                                        </div>
                                    );

                                    // Helper to get top tiers for spotlight
                                    const getBestTiers = (p: Player) => {
                                        return Object.entries(p.tiers)
                                            .filter(([_, data]) => data && !data.retired)
                                            .sort((a, b) => {
                                                const orderA = TIER_ORDER[a[1].current as string] ?? 99;
                                                const orderB = TIER_ORDER[b[1].current as string] ?? 99;
                                                return orderA - orderB;
                                            })
                                            .slice(0, 3);
                                    };

                                    if (selectedMode === 'Overall' && championCandidates.length >= 1) {
                                        const top3 = championCandidates.slice(0, 3);
                                        return (
                                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                                                {/* Rank #1 - HERO CARD */}
                                                <motion.div
                                                    key={top3[0].uuid}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="xl:col-span-12 relative group overflow-hidden rounded-[40px] border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-zinc-900/60 to-black/80 p-8 lg:p-12 shadow-2xl shadow-amber-400/10"
                                                >
                                                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 pointer-events-none">
                                                        <Trophy className="w-80 h-80 text-amber-400" />
                                                    </div>

                                                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                                                        <div className="relative group">
                                                            <div className="absolute inset-0 bg-amber-400/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <img
                                                                src={getFullSkinRenderUrl(top3[0].uuid)}
                                                                alt={top3[0].username}
                                                                className="w-56 lg:w-72 drop-shadow-[0_0_60px_rgba(251,191,36,0.4)] group-hover:scale-105 transition-transform duration-700"
                                                            />
                                                        </div>
                                                        <div className="flex-1 text-center lg:text-left space-y-8">
                                                            <div className="space-y-4">
                                                                <div className={cn("inline-flex items-center gap-2 px-6 py-2 rounded-2xl font-black uppercase tracking-tighter italic text-sm shadow-xl border-2", getPlayerGlobalRank(top3[0].uuid) === 1 ? "bg-amber-400 text-black shadow-amber-400/30 border-amber-500" : "bg-zinc-800 text-white shadow-black/30 border-zinc-700")}>
                                                                    <Trophy className="w-4 h-4" />
                                                                    {getPlayerGlobalRank(top3[0].uuid) === 1 ? "Server Legend #1" : `Global Rank #${getPlayerGlobalRank(top3[0].uuid)}`}
                                                                </div>
                                                                <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-none max-w-full break-words">
                                                                    {top3[0].username}
                                                                </h3>
                                                                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                                                    {getBestTiers(top3[0]).map(([mode, data]) => (
                                                                        <div key={mode} className="flex flex-col items-center">
                                                                            <TierBadge tier={data.current as Tier} size="md" className="shadow-lg border-white/10" />
                                                                            <span className="text-[8px] font-black text-zinc-500 uppercase mt-1">{mode}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                                                <Link
                                                                    href={`/player/${top3[0].uuid}`}
                                                                    className="px-10 py-5 bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-300 transition-all hover:scale-105 shadow-2xl shadow-amber-400/20"
                                                                >
                                                                    View Profile
                                                                </Link>
                                                                <div className="px-8 py-5 glass-premium rounded-2xl border-amber-400/20 group-hover:bg-amber-400/5 transition-colors">
                                                                    <span className="text-zinc-500 font-bold mr-3 uppercase text-xs tracking-[0.2em]">Total Score</span>
                                                                    <span className="text-4xl font-black text-amber-400">{top3[0].totalPoints}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Rank #2 and #3 */}
                                                <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {[top3[1], top3[2]].filter(Boolean).map((p, i) => (
                                                        <motion.div
                                                            key={p.uuid}
                                                            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.1 }}
                                                            className="relative glass-premium p-8 rounded-[40px] border border-white/5 overflow-hidden group hover:border-primary/40 transition-all"
                                                        >
                                                            <div className="flex items-center gap-8 relative z-10">
                                                                <div className="relative">
                                                                    <div className="absolute inset-0 bg-primary/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <img
                                                                        src={getPlayerSkinUrl(p.uuid)}
                                                                        alt={p.username}
                                                                        className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 relative z-10 object-cover group-hover:scale-110 transition-transform shadow-2xl"
                                                                    />
                                                                    <div className={cn(
                                                                        "absolute -top-3 -left-3 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl italic z-20 shadow-xl border-2",
                                                                        getPlayerGlobalRank(p.uuid) === 2 ? "bg-zinc-300 text-black border-white" :
                                                                            getPlayerGlobalRank(p.uuid) === 3 ? "bg-orange-600 text-white border-orange-400" :
                                                                                "bg-zinc-800 text-zinc-300 border-zinc-600"
                                                                    )}>
                                                                        #{getPlayerGlobalRank(p.uuid)}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 space-y-4">
                                                                    <div>
                                                                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter truncate">{p.username}</h4>
                                                                        <div className="text-primary font-black text-xl">{p.totalPoints} <span className="text-[10px] text-zinc-500 uppercase tracking-widest ml-1">Points</span></div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        {getBestTiers(p).slice(0, 3).map(([mode, data]) => (
                                                                            <div key={mode} className="flex flex-col items-center">
                                                                                <TierBadge tier={data.current as Tier} size="sm" className="opacity-80 scale-90" />
                                                                                <span className="text-[7px] font-black text-zinc-600 uppercase mt-0.5">{mode}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <Link
                                                                        href={`/player/${p.uuid}`}
                                                                        className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border-b border-white/5 hover:border-white/20 pb-1"
                                                                    >
                                                                        View Profile
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 -rotate-6 pointer-events-none transition-transform group-hover:scale-150 group-hover:rotate-0 duration-500">
                                                                <Trophy className="w-40 h-40 text-white" />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            key={champion.uuid}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative group overflow-hidden rounded-[40px] border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-zinc-900/40 to-black/60 p-8 lg:p-12 shadow-2xl shadow-amber-400/5"
                                        >
                                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12">
                                                <Trophy className="w-64 h-64 text-amber-400" />
                                            </div>

                                            <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                                                <img
                                                    src={getFullSkinRenderUrl(champion.uuid)}
                                                    alt={champion.username}
                                                    className="w-48 lg:w-64 drop-shadow-[0_0_50px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="flex-1 text-center lg:text-left space-y-6">
                                                    <div>
                                                        <div className="mb-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                                                            {selectedMode === 'Overall' ? (
                                                                <span className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-black italic tracking-tighter uppercase text-xs shadow-xl shadow-amber-400/20 border-2 border-amber-500">
                                                                    Top Ranked Leader
                                                                </span>
                                                            ) : (
                                                                <TierBadge tier="HT1" size="lg" className="shadow-xl shadow-amber-400/20" />
                                                            )}
                                                        </div>
                                                        <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
                                                            {champion.username}
                                                        </h3>
                                                        <p className="text-amber-400/60 font-bold tracking-widest uppercase text-sm mt-2">
                                                            {selectedMode === 'Overall' ? 'Most Respected Combatant' : `Undisputed Champion of ${selectedMode}`}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                                        <Link
                                                            href={`/player/${champion.uuid}`}
                                                            className="px-8 py-4 bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-300 transition-colors shadow-xl shadow-amber-400/10"
                                                        >
                                                            View Full Profile
                                                        </Link>
                                                        <div className="px-6 py-4 glass-premium rounded-2xl">
                                                            <span className="text-zinc-500 font-bold mr-2 uppercase text-xs">Points</span>
                                                            <span className="text-2xl font-black text-white">{champion.totalPoints}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })()}
                            </div>
                        </section>

                        {/* If Overall, show a list. If specific mode, show divisions */}
                        {selectedMode === 'Overall' ? (
                            <section className="space-y-8">
                                <div className="flex items-center gap-3 px-4">
                                    <Users className="w-5 h-5 text-zinc-500" />
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest italic tracking-[0.2em]">Global Leaderboard</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...filteredPlayers]
                                        .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
                                        .slice(selectedMode === 'Overall' ? 3 : 0, 203) // Up to 200 players after top 3
                                        .map((player, idx) => (
                                            <motion.div
                                                key={player.uuid}
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-20px" }}
                                                transition={{ duration: 0.2, delay: (idx % 6) * 0.03 }}
                                            >
                                                <Link
                                                    href={`/player/${player.uuid}`}
                                                    className="glass-premium p-6 rounded-[32px] flex items-center justify-between group hover:border-primary/40 transition-all h-full block"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 flex items-center justify-center font-black text-zinc-700 text-xl group-hover:text-primary italic">
                                                            #{getPlayerGlobalRank(player.uuid)}
                                                        </div>
                                                        <img src={getPlayerSkinUrl(player.uuid)} className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5" />
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-white group-hover:text-primary transition-colors">{player.username}</span>
                                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Veteran</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-white">{player.totalPoints}</div>
                                                        <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">PTS</div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                </div>
                            </section>
                        ) : (
                            <>
                                {/* MID SECTION: High Tiers (LT1 - HT3) */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {[
                                        { id: 'LT1', label: 'Low Tier 1' },
                                        { id: 'HT2', label: 'High Tier 2' },
                                        { id: 'LT2', label: 'Low Tier 2' },
                                        { id: 'HT3', label: 'High Tier 3' }
                                    ].map((tier) => (
                                        <section key={tier.id} className="space-y-4">
                                            <div className="flex items-center gap-2 px-2">
                                                <Star className="w-4 h-4 text-primary" />
                                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">{tier.label}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {groupedPlayers[tier.id].length > 0 ? (
                                                    groupedPlayers[tier.id].map((player) => (
                                                        <Link
                                                            key={player.uuid}
                                                            href={`/player/${player.uuid}`}
                                                            className="glass-premium hover:border-primary/30 p-4 rounded-[28px] flex items-center gap-4 transition-all group hover:bg-white/[0.02]"
                                                        >
                                                            <img
                                                                src={getPlayerSkinUrl(player.uuid)}
                                                                alt={player.username}
                                                                className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/5 shadow-lg shadow-black/40 group-hover:rotate-6 transition-transform"
                                                            />
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="font-black text-white group-hover:text-primary transition-colors truncate">
                                                                    {player.username}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <TierBadge tier={tier.id as Tier} size="sm" className="opacity-80 shadow-sm" />
                                                                    <span className="text-[10px] text-zinc-600 font-bold">{player.totalPoints} PTS</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="col-span-1 sm:col-span-2 p-8 text-center glass rounded-[28px] opacity-10">
                                                        <span className="text-xs font-bold uppercase tracking-widest">Entry Vacant</span>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    ))}
                                </div>

                                {/* BOTTOM SECTION: Development Tiers (LT3 - LT5) */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 px-2 border-b border-white/5 pb-4">
                                        <Users className="w-4 h-4 text-zinc-600" />
                                        <h3 className="text-sm font-black text-zinc-600 uppercase tracking-[0.3em]">Rising Ranks (Tier 3-5)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {['LT3', 'HT4', 'LT4', 'HT5', 'LT5'].flatMap(t => groupedPlayers[t]).map((player, idx) => (
                                            <Link
                                                key={player.uuid + idx}
                                                href={`/player/${player.uuid}`}
                                                className="glass p-4 rounded-2xl flex flex-col items-center gap-3 text-center hover:bg-white/[0.05] transition-all group hover:-translate-y-1"
                                            >
                                                <img
                                                    src={getPlayerSkinUrl(player.uuid)}
                                                    alt={player.username}
                                                    className="w-12 h-12 rounded-xl border border-white/5 shadow-inner"
                                                />
                                                <div className="flex flex-col gap-1 w-full">
                                                    <span className="text-[10px] font-black text-white truncate px-1">
                                                        {player.username}
                                                    </span>
                                                    <div className="flex justify-center">
                                                        {player.tiers[selectedMode] ? (
                                                            <TierBadge
                                                                tier={player.tiers[selectedMode].current as Tier}
                                                                size="sm"
                                                                className="text-[9px] h-4 scale-90 border-transparent bg-zinc-800/50"
                                                            />
                                                        ) : (
                                                            <span className="text-[9px] font-black text-zinc-700 uppercase italic">Unranked</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </>
                ) : (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 border-b border-white/5 pb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
                                <Search className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest italic tracking-tight">
                                    Search Results
                                </h2>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Found {filteredPlayers.length} match{filteredPlayers.length !== 1 ? 'es' : ''} for "{searchQuery}"</p>
                            </div>
                        </div>

                        {filteredPlayers.length === 0 ? (
                            <div className="p-20 text-center border border-dashed border-white/5 rounded-[40px] opacity-50 bg-black/20">
                                <p className="text-zinc-500 font-bold uppercase tracking-widest">No players found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPlayers.map((player) => (
                                    <Link
                                        key={player.uuid}
                                        href={`/player/${player.uuid}`}
                                        className="glass-premium p-6 rounded-[32px] flex items-center justify-between group hover:border-primary/40 transition-all border border-white/5 hover:bg-white/[0.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 flex flex-col items-center justify-center bg-black/50 rounded-2xl border border-white/5 shrink-0 group-hover:border-primary/30 transition-colors">
                                                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1 group-hover:text-primary/70 transition-colors">Global</span>
                                                <span className="font-black text-zinc-300 leading-none group-hover:text-primary transition-colors">#{getPlayerGlobalRank(player.uuid)}</span>
                                            </div>
                                            <img src={getPlayerSkinUrl(player.uuid)} className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 shadow-md group-hover:scale-105 transition-transform shrink-0" />
                                            <div className="flex flex-col min-w-0 pr-4">
                                                <span className="font-black text-white group-hover:text-primary transition-colors text-lg tracking-tight truncate">{player.username}</span>
                                                {selectedMode !== 'Overall' ? (
                                                    <div className="mt-1 flex items-center">
                                                        {player.tiers[selectedMode] && !player.tiers[selectedMode].retired ? (
                                                            <TierBadge tier={player.tiers[selectedMode].current as Tier} size="sm" className="opacity-90 scale-90 origin-left" />
                                                        ) : (
                                                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] italic truncate block">Unranked {selectedMode}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] truncate mt-1 block">Global Competitor</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end shrink-0 pl-4 border-l border-white/5">
                                            <div className="text-2xl font-black text-white leading-none">{player.totalPoints}</div>
                                            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Total PTS</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                )}

            </div>
        </div>
    );
}
