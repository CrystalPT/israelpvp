import { Tier, GameMode, PlayerTier } from '../types';

export const TIER_POINTS: Record<Tier, number> = {
    HT1: 60,
    LT1: 45,
    HT2: 30,
    LT2: 20,
    HT3: 10,
    LT3: 6,
    HT4: 4,
    LT4: 3,
    HT5: 2,
    LT5: 1,
};

export const TIER_ORDER: Tier[] = [
    'HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5'
];

/**
 * HT1 Uniqueness Rule:
 * Only one player can hold the HT1 tier at a time in a specific gamemode.
 * When promoting a player to HT1, the current HT1 player must be demoted or retired.
 */

export const calculatePoints = (tiers: Record<string, PlayerTier>): number => {
    return Object.values(tiers).reduce((total, tier) => {
        return total + (TIER_POINTS[tier.current] || 0);
    }, 0);
};

export const isRetireable = (tier: Tier): boolean => {
    const retireableTiers: Tier[] = ['HT1', 'LT1', 'HT2', 'LT2'];
    return retireableTiers.includes(tier);
};

export const getTierLabel = (tier: Tier, retired: boolean): string => {
    return retired ? `R(${tier})` : tier;
};

export const compareTiers = (a: Tier, b: Tier): number => {
    return TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b);
};

export const handleRetire = (currentTier: PlayerTier): PlayerTier => {
    if (!isRetireable(currentTier.current)) return currentTier;

    return {
        ...currentTier,
        retired: true,
        peak: null, // Retiring clears the peak tier
    };
};

export const handleUnretire = (currentTier: PlayerTier, testResult: 'won' | 'lost'): PlayerTier => {
    if (!currentTier.retired) return currentTier;

    let newTier = currentTier.current;
    if (testResult === 'lost') {
        // Demote tier if lost to same-tier
        const currentIndex = TIER_ORDER.indexOf(currentTier.current);
        if (currentIndex < TIER_ORDER.length - 1) {
            newTier = TIER_ORDER[currentIndex + 1];
        }
    }

    return {
        current: newTier,
        peak: null, // Peak tier resets on unretire
        retired: false,
    };
};
