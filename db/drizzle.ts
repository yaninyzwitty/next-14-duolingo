import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
import * as schema from "./schema"


// @ts-ignore
const db = drizzle(sql, { schema });


export default db;




