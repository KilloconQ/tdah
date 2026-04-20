import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const isLocal = process.env.DATABASE_URL.startsWith('file:');
if (!isLocal && !process.env.DATABASE_AUTH_TOKEN) {
	throw new Error('DATABASE_AUTH_TOKEN is required for remote databases');
}

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: process.env.NODE_ENV === 'dev' ? 'sqlite' : 'turso',
	dbCredentials: {
		authToken: process.env.DATABASE_AUTH_TOKEN,
		url: process.env.DATABASE_URL
	},
	verbose: true,
	strict: true
});
