export const getMojangUsername = async (uuid: string): Promise<string | null> => {
    // Check if we're in the browser to avoid CORS issues with Mojang API
    if (typeof window !== 'undefined') {
        return null;
    }

    try {
        const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error fetching Mojang username (likely CORS or network):', error);
        return null;
    }
};

export const getUuidFromUsername = async (username: string): Promise<{ uuid: string, username: string } | null> => {
    try {
        // Using Ashcon API to bypass CORS natively in the browser
        const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
        if (!response.ok) return null;
        const data = await response.json();
        return { uuid: data.uuid, username: data.username };
    } catch (error) {
        console.error('Error fetching UUID from username:', error);
        return null;
    }
};

export const getPlayerSkinUrl = (uuid: string): string => {
    return `https://render.crafty.gg/3d/bust/${uuid}`;
};

export const getFullSkinRenderUrl = (uuid: string): string => {
    return `https://render.crafty.gg/3d/bust/${uuid}`;
};
