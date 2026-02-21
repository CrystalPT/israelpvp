export type Tier = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5';

export interface PlayerTier {
    current: Tier;
    peak: Tier | null;
    retired: boolean;
    lastTestedAt?: number;
}

export type GameMode = 'Overall' | 'UHC' | 'Sword' | 'Speed' | 'Pot' | 'NethOP' | 'SMP' | 'Diamond SMP' | 'Vanilla';

export interface Player {
    uuid: string;
    username: string;
    tiers: Record<GameMode, PlayerTier>;
    totalPoints?: number;
}

export interface Punishment {
    id?: string;
    uuid: string;
    reason: string;
    date: any; // Firestore Timestamp
    evidence: string | null;
    username?: string; // For display
}
