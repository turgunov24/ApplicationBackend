import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schemas/index.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
