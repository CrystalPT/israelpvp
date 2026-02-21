"use client";

import { useState, useEffect } from "react";
import { Player } from "@/types";
import { getPlayers } from "@/lib/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { RankingTable } from "@/components/tierlist/RankingTable";
import { Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen pt-32 pb-24 relative bg-dot-pattern">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[150px] animate-pulse" />
      </div>

      <Navbar />
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="mb-24 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-3xl">
            

            <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.85]">
              Official<br /><span className="text-primary text-glow">Rankings</span>
            </h1>
            <p className="text-zinc-500 font-bold text-xl leading-relaxed max-w-xl">
              IsraelPVP's competitive player rankings. Verified tier distributions across all competitive gamemodes.
            </p>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-40 bg-zinc-900/20 rounded-[60px] border border-white/[0.03]">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Building Leaderboards...</p>
            </div>
          ) : players.length > 0 ? (
            <RankingTable players={players} />
          ) : (
            <div className="text-center p-32 bg-zinc-900/20 rounded-[60px] border border-white/[0.03]">
              <Trophy className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Leaderboard Empty</h2>
              <p className="text-zinc-500 font-bold max-w-xs mx-auto">Visit <code className="text-primary">/api/seed</code> to initialize the competitive rankings.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
