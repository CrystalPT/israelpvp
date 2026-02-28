import { NextResponse } from 'next/server';
import { getPlayerByUuid, getPlayerByUsername, getPlayers } from '@/lib/firestore';

// Helper to determine if a string looks like a standard Minecraft UUID (with or without dashes)
const isUuid = (id: string) => {
    // 32-hex chars or 8-4-4-4-12 hex chars
    const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Missing player ID or username" }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                }
            });
        }

        let player;

        if (isUuid(id)) {
            // Strip dashes if necessary to ensure uniform querying, though if they exist with dashes in db, keep as is
            // Assuming they are stored exactly as passed / fetched
            player = await getPlayerByUuid(id);
        } else {
            player = await getPlayerByUsername(id);
        }

        if (!player) {
            return NextResponse.json({ error: "Player not found" }, {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                }
            });
        }

        // Calculate global ranking
        const allPlayers = await getPlayers();
        const globalRank = allPlayers.findIndex(p => p.uuid === player?.uuid) + 1;

        return NextResponse.json({
            ...player,
            globalRank: globalRank > 0 ? globalRank : null
        }, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            }
        });

    } catch (error: any) {
        console.error("API Error fetching player:", error);
        return NextResponse.json({ error: "Internal server error" }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            }
        });
    }
}

// Support OPTIONS pre-flight request for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
