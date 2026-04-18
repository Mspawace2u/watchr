import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.DATABASE_URL;

if (!databaseUrl) {
  if (import.meta.env.DEV) {
    console.warn('DATABASE_URL is not defined. Neon client is uninitialized. Ensure your .env file is set up.');
  }
}

export const sql = neon(databaseUrl || '');
