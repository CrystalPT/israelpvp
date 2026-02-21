import { Punishment } from "@/types";
import { getPlayerSkinUrl } from "@/utils/mojang-api";
import { ExternalLink, Calendar, Gavel } from "lucide-react";
import { format } from "date-fns";

interface PunishmentCardProps {
    punishment: Punishment;
}

export function PunishmentCard({ punishment }: PunishmentCardProps) {
    const dateStr = punishment.date?.toDate
        ? format(punishment.date.toDate(), "MMM d, yyyy")
        : "Recently";

    return (
        <div className="bg-zinc-900/20 border border-white/[0.03] hover:border-red-500/30 rounded-[32px] p-6 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(239,68,68,0.05)]">
            <div className="flex items-start gap-6">
                <div className="relative">
                    <img
                        src={getPlayerSkinUrl(punishment.uuid)}
                        alt="Player Head"
                        className="w-16 h-16 rounded-2xl shadow-lg shadow-black/40 border border-white/5 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-xl border border-white/5 flex items-center justify-center">
                        <Gavel className="w-4 h-4 text-red-500" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="font-black text-xl text-white tracking-tight truncate group-hover:text-red-400 transition-colors">
                            {punishment.username || "Unknown Player"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
                            <Calendar className="w-3 h-3" />
                            {dateStr}
                        </div>
                    </div>

                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5 mb-4 group-hover:border-red-500/10 transition-colors">
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            {punishment.reason}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {punishment.evidence ? (
                            <a
                                href={punishment.evidence}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                            >
                                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <ExternalLink className="w-3 h-3" />
                                </div>
                                View Evidence
                            </a>
                        ) : (
                            <span className="text-xs text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                                    <ExternalLink className="w-3 h-3 opacity-20" />
                                </div>
                                No Evidence
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
