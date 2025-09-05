// Make sure to install the 'pg' package
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.NODE_ENV === 'production'
			? {
					rejectUnauthorized: false, // Set to true in production with proper certificates
			  }
			: false, // Disable SSL for local development
});

const db = drizzle(pool, { casing: 'camelCase' });

export default db;
