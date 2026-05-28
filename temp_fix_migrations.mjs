import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query('DELETE FROM "_prisma_migrations" WHERE migration_name = $1', ['20260528140228_cleanup_admin_system']);
const res = await client.query('SELECT migration_name, finished_at, applied_steps_count FROM "_prisma_migrations" ORDER BY finished_at DESC NULLS LAST;');
console.log('Remaining migrations:');
console.table(res.rows);
await client.end();
