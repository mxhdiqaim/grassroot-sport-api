import { Elysia, t } from 'elysia';
import db from '../db';
import { eq } from 'drizzle-orm';
import { createLiveInput } from '../services/cloudflare';
import {matches} from "../schema/match-schema.ts";

// This is a "Plugin". It can be used by the main app.
export const matchRoutes = new Elysia({ prefix: '/matches' })
    .get('/', async () => {
        return await db.select().from(matches);
    })

    .post('/:id/go-live', async ({ params, error }) => {
        const matchId = Number(params.id);

        // Check if a match exists
        const [match] = await db.select().from(matches).where(eq(matches.id, matchId));
        if (!match) return error(404, "Match not found");

        // Call Cloudflare (Service we discussed)
        const input = await createLiveInput(match.title);

        // Update DB
        await db.update(matches)
            .set({
                cloudflareInputId: input.uid,
                streamKey: input.rtmps.streamKey,
                rtmpsUrl: input.rtmps.url,
                playbackUrl: input.playback.hls,
                status: 'live'
            })
            .where(eq(matches.id, matchId));

        return {
            stream_url: input.rtmps.url,
            stream_key: input.rtmps.streamKey
        };
    }, {
        // Built-in validation replaces 'express-validator' or manual checks
        params: t.Object({
            id: t.String()
        })
    });