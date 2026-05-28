import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const res1 = await client.query('SELECT migration_name, checksum, finished_at, applied_steps_count FROM "_prisma_migrations" ORDER BY finished_at DESC NULLS LAST;');
console.log('--- _prisma_migrations ---');
console.table(res1.rows);

const res2 = await client.query('SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name=\'AssetConfig\' ORDER BY ordinal_position;');
console.log('--- AssetConfig columns ---');
console.table(res2.rows);

await client.end();
