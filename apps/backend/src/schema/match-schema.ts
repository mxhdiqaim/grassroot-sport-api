import {pgTable, serial, text, timestamp, pgEnum} from 'drizzle-orm/pg-core';

const matchStatusEnum = pgEnum("matchStatus", ["scheduled", "live", "ended"]);

export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    status: matchStatusEnum("status").notNull().default("scheduled"), // 'scheduled' || 'live' || 'ended'
    streamKey: text('streamKey'),
    rtmpsUrl: text('rtmpsUrl'),
    cloudflareInputId: text('cloudflareInputId'),
    playbackUrl: text('playbackUrl'), // The HLS (.m3u8) link
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lastModified: timestamp("lastModified")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date()),
});