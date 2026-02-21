import { db } from './firebase';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { Player, Punishment } from '../types';
import { calculatePoints } from '../utils/tier-logic';
import { getMojangUsername } from '../utils/mojang-api';

export const getPlayers = async (): Promise<Player[]> => {
    const playersCol = collection(db, 'players');
    const playerSnapshot = await getDocs(playersCol);
    const playerList = playerSnapshot.docs.map(doc => {
        const data = doc.data() as Player;
        return {
            ...data,
            totalPoints: calculatePoints(data.tiers)
        };
    });

    // Sort by total points descending
    return playerList.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
};

export const updatePlayerUsername = async (uuid: string, newUsername: string) => {
    await updateDoc(doc(db, 'players', uuid), { username: newUsername });
};

export const getPlayerByUuid = async (uuid: string): Promise<Player | null> => {
    const playerDoc = await getDoc(doc(db, 'players', uuid));
    if (!playerDoc.exists()) return null;

    const data = playerDoc.data() as Player;

    // Username sync logic
    const mojangUsername = await getMojangUsername(uuid);
    if (mojangUsername && mojangUsername !== data.username) {
        await updateDoc(doc(db, 'players', uuid), { username: mojangUsername });
        data.username = mojangUsername;
    }

    return {
        ...data,
        totalPoints: calculatePoints(data.tiers)
    };
};

export const getPlayerByUsername = async (username: string): Promise<Player | null> => {
    // Attempt exact match first
    const playersCol = collection(db, 'players');

    // Note: Firestore doesn't support native case-insensitive queries without a dedicated lower-case field.
    // We will pull the list and find the match client/server side if necessary, 
    // but typically a direct query is over the whole list anyway since it's 100 players.
    // For scale, we query all and find.
    const playerSnapshot = await getDocs(playersCol);
    const lowercaseQuery = username.toLowerCase();

    const matchedDoc = playerSnapshot.docs.find(doc =>
        (doc.data().username as string).toLowerCase() === lowercaseQuery
    );

    if (!matchedDoc) return null;

    const data = matchedDoc.data() as Player;
    return {
        ...data,
        totalPoints: calculatePoints(data.tiers)
    };
};

export const getPunishments = async (): Promise<Punishment[]> => {
    const punishmentsCol = collection(db, 'punishments');
    const q = query(punishmentsCol, orderBy('date', 'desc'));
    const punishmentSnapshot = await getDocs(q);
    return punishmentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Punishment[];
};
