import {getEnvVariable} from "../utils";

const CLOUDFLARE_ACCOUNT_ID = getEnvVariable("CLOUDFLARE_ACCOUNT_ID");
const CLOUDFLARE_API_TOKEN = getEnvVariable("CLOUDFLARE_API_TOKEN");

export const createLiveInput = async (matchTitle: string) => {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meta: { name: matchTitle },
                recording: { mode: 'automatic' }, // Automatically save for replays
            }),
        }
    );

    const data = await response.json();

    // @ts-ignore
    return data.result; // Contains uid, rtmps { url, streamKey }, and playback { hls }
};