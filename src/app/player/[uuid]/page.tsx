"use client";

import { useState, useEffect, use } from "react";
import { Player } from "@/types";
import { getPlayerByUuid, getPlayerByUsername, updatePlayerUsername } from "@/lib/firestore";
import { getUuidFromUsername } from "@/utils/mojang-api";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PlayerProfile } from "@/components/player/PlayerProfile";
import { UserX } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ uuid: string }>;
}

export default function PlayerPage({ params }: PageProps) {
    const { uuid } = use(params);
    const router = useRouter();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First attempt: treat the param as a UUID (case-insensitive)
                const data = await getPlayerByUuid(uuid.toLowerCase());

                if (data) {
                    setPlayer(data);
                } else {
                    // Second attempt: treat the param as a Username
                    const byUsername = await getPlayerByUsername(uuid);
                    if (byUsername && byUsername.uuid) {
                        // Redirect to the canonical UUID URL
                        router.push(`/player/${byUsername.uuid}`);
                        return; // Prevent further execution/un-hiding loader until navigation completes
                    } else {
                        // Third attempt: Call Mojang API to see if they changed their username
                        const mojangData = await getUuidFromUsername(uuid);
                        if (mojangData && mojangData.uuid) {
                            // Check if this resolved UUID is actually in our database
                            const existingPlayer = await getPlayerByUuid(mojangData.uuid);
                            if (existingPlayer) {
                                // They are in our DB! Update their localized username and redirect
                                await updatePlayerUsername(mojangData.uuid, mojangData.username);
                                router.push(`/player/${mojangData.uuid}`);
                                return;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching player:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [uuid, router]);

    return (
        <main className="min-h-screen pt-24 pb-12">
            <Navbar />
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-zinc-500 font-bold">Loading player profile...</p>
                    </div>
                </div>
            ) : player ? (
                <PlayerProfile player={player} />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <UserX className="w-20 h-20 text-zinc-800 mb-6" />
                    <h1 className="text-3xl font-black text-white mb-2">Player Not Found</h1>
                    <p className="text-zinc-500 mb-8 max-w-md">
                        We couldn't find a player with the UUID <code className="text-zinc-400">{uuid}</code> in our database.
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-glow"
                    >
                        Back to Tierlist
                    </Link>
                </div>
            )}
        </main>
    );
}
