"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, Gavel, User, LayoutGrid, Check, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
    { name: 'Leaderboards', href: '/', icon: LayoutGrid },
    { name: 'Punishments', href: '/punishments', icon: Shield },
];

export function Navbar() {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("play.israelpvp.net");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none text-white">
            <div className="glass-premium px-8 py-3 rounded-[32px] flex items-center justify-between gap-12 pointer-events-auto border-white/10 shadow-2xl backdrop-blur-2xl">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] overflow-hidden p-1.5">
                        <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-xl text-white tracking-tighter uppercase italic">
                        Israel<span className="text-primary">PVP</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-colors",
                                    isActive ? "text-primary" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute -bottom-1 left-0 right-0 h-px bg-primary shadow-[0_0_10px_rgba(59,130,246,1)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-5 border-l border-white/5 pl-8">
                    <button
                        onClick={handleCopy}
                        className="hidden lg:flex flex-col items-end group relative"
                    >
                        <div className="flex items-center gap-2 mb-0.5">
                            {copied ? (
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Copied!</span>
                            ) : (
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Server IP</span>
                            )}
                            {copied ? (
                                <Check className="w-2.5 h-2.5 text-primary" />
                            ) : (
                                <Copy className="w-2.5 h-2.5 text-zinc-700 group-hover:text-primary transition-colors" />
                            )}
                        </div>
                        <span className={cn(
                            "text-xs font-black transition-all",
                            copied ? "text-white scale-105" : "text-zinc-400 group-hover:text-white"
                        )}>
                            play.israelpvp.net
                        </span>

                        {/* Tooltip */}
                        <div className="absolute -top-8 right-0 bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-y-2 group-hover:translate-y-0 tracking-tighter uppercase italic truncate whitespace-nowrap">
                            Click to Copy
                        </div>
                    </button>

                    <a
                        href="https://discord.gg/8BdnpEJJ7T"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center hover:bg-[#5865F2] hover:border-transparent transition-all hover:scale-110 group shadow-lg shadow-[#5865F2]/5"
                    >
                        <svg
                            viewBox="0 0 22 19"
                            className="w-6 h-6 fill-[#5865F2] group-hover:fill-white transition-all transform group-hover:rotate-6"
                        >
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C1.536 7.49.944 10.53 1.238 13.521a.073.073 0 0 0 .028.052c1.764 1.294 3.478 2.083 5.161 2.599a.077.077 0 0 0 .085-.028c.398-.544.747-1.124 1.042-1.737a.076.076 0 0 0-.041-.105 13.11 13.11 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.541 1.62 7.357 1.62 10.852 0a.073.073 0 0 1 .077.01c.124.095.25.193.372.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.297.61.647 1.192.1 1.735a.077.077 0 0 0 .085.029c1.688-.516 3.402-1.305 5.166-2.6a.07.07 0 0 0 .028-.051c.366-3.463-.6-6.471-2.584-9.15a.045.045 0 0 0-.031-.027zM8.02 11.232c-1.213 0-2.214-1.114-2.214-2.484 0-1.37 0.983-2.484 2.214-2.484 1.24 0 2.238 1.114 2.214 2.484 0 1.37-.975 2.484-2.214 2.484zm7.98 0c-1.213 0-2.214-1.114-2.214-2.484 0-1.37 0.983-2.484 2.214-2.484 1.24 0 2.238 1.114 2.214 2.484 0 1.37-.975 2.484-2.214 2.484z" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    );
}
