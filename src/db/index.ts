import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import schema from "./schema.ts";
import { getEnvVariable } from "../utils";

const NODE_ENV = getEnvVariable("NODE_ENV");
const sslRequired = getEnvVariable("DB_SSL_REQUIRED") === "true";

const connectionString = NODE_ENV === "production"
    ? getEnvVariable("DB_CONNECTION_STRING")
    : getEnvVariable("DATABASE_URL");

const poolConfig: PoolConfig = {
    connectionString,
    ssl: sslRequired ? { rejectUnauthorized: false } : false,
};

export const pool = new Pool(poolConfig);
const db = drizzle(pool, { schema });

export const connect = async () => {
    const client = await pool.connect();
    client.release(); // Test connection and release back to the pool
};

export default db;