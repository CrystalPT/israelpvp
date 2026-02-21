import { cn } from "@/utils/cn";

export type Tier = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5';

export const TIER_NAMES: Record<Tier, string> = {
    HT1: 'High Tier 1',
    LT1: 'Low Tier 1',
    HT2: 'High Tier 2',
    LT2: 'Low Tier 2',
    HT3: 'High Tier 3',
    LT3: 'Low Tier 3',
    HT4: 'High Tier 4',
    LT4: 'Low Tier 4',
    HT5: 'High Tier 5',
    LT5: 'Low Tier 5',
};

interface TierBadgeProps {
    tier: Tier;
    retired?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const tierConfig: Record<Tier, { color: string; bg: string; border: string }> = {
    HT1: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    LT1: { color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
    HT2: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    LT2: { color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    HT3: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    LT3: { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    HT4: { color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20" },
    LT4: { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    HT5: { color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
    LT5: { color: "text-zinc-600", bg: "bg-zinc-600/10", border: "border-zinc-600/20" },
};

export function TierBadge({ tier, retired, size = "md", className }: TierBadgeProps) {
    const config = tierConfig[tier];

    const sizeClasses = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-5 py-2 text-sm",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center font-black italic uppercase tracking-tighter rounded-lg border-2 transition-all duration-300",
                config.bg,
                config.color,
                config.border,
                sizeClasses[size],
                retired && "opacity-50 grayscale contrast-125",
                className
            )}
        >
            <span className="drop-shadow-sm">
                {retired ? `R(${tier})` : tier}
            </span>
        </div>
    );
}
