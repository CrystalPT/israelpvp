"use client";

import { GameMode } from "@/types";
import { cn } from "@/utils/cn";
import { Sword, Zap, Heart, Shield, Gem, LayoutGrid, Sparkles, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface ModeTabsProps {
    selected: GameMode;
    onSelect: (mode: GameMode) => void;
}

const modes: { id: GameMode; label: string; icon: any; color: string }[] = [
    { id: 'Overall', label: 'Overall', icon: LayoutGrid, color: 'text-white' },
    { id: 'Vanilla', label: 'Vanilla', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'Diamond SMP', label: 'Diamond SMP', icon: Gem, color: 'text-amber-500' },
    { id: 'SMP', label: 'SMP', icon: Shield, color: 'text-emerald-500' },
    { id: 'Pot', label: 'Pot', icon: Heart, color: 'text-blue-400' },
    { id: 'Sword', label: 'Sword', icon: Sword, color: 'text-emerald-400' },
    { id: 'UHC', label: 'UHC', icon: Flame, color: 'text-purple-400' },
    { id: 'Speed', label: 'Speed', icon: Zap, color: 'text-yellow-400' },
    { id: 'NethOP', label: 'Neth OP', icon: Shield, color: 'text-red-400' },
];

export function ModeTabs({ selected, onSelect }: ModeTabsProps) {
    return (
        <div className="w-full flex flex-wrap items-center justify-center gap-4 lg:gap-8 px-4 py-8">
            {modes.map((mode) => {
                const isActive = selected === mode.id;
                return (
                    <button
                        key={mode.id}
                        onClick={() => onSelect(mode.id)}
                        className="group relative flex flex-col items-center gap-3 transition-all duration-300"
                    >
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                            isActive
                                ? "bg-primary border-primary shadow-[0_0_30px_rgba(59,130,246,0.3)] -translate-y-2"
                                : "bg-zinc-900 border-white/5 group-hover:border-white/20 group-hover:scale-110"
                        )}>
                            <mode.icon className={cn(
                                "w-6 h-6 transition-colors duration-500",
                                isActive ? "text-white" : "text-zinc-600 group-hover:text-white"
                            )} />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                                isActive ? "text-white" : "text-zinc-500"
                            )}>
                                {mode.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"
                                />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
