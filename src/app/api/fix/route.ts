import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function GET() {
    try {
        const playersSnapshot = await getDocs(collection(db, 'players'));
        let updatesCount = 0;

        for (const playerDoc of playersSnapshot.docs) {
            const player = { id: playerDoc.id, ...playerDoc.data() as any };
            let needsUpdate = false;
            const updatedTiers = { ...player.tiers };

            // Check every gamemode for this player
            for (const mode in updatedTiers) {
                const tierData = updatedTiers[mode];
                if (tierData && tierData.retired && tierData.peak !== null) {
                    // If they are retired but still have a peak recorded, wipe it
                    updatedTiers[mode] = { ...tierData, peak: null };
                    needsUpdate = true;
                }

                // Add lastTestedAt if missing
                if (tierData && !tierData.lastTestedAt) {
                    updatedTiers[mode] = { ...updatedTiers[mode], lastTestedAt: Date.now() };
                    needsUpdate = true;
                }
            }

            // Push the update if we modified anything
            if (needsUpdate) {
                await updateDoc(doc(db, 'players', player.id), { tiers: updatedTiers });
                updatesCount++;
            }
        }

        return NextResponse.json({ success: true, playersUpdated: updatesCount });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
