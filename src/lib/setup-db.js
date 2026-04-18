import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function setupDatabase() {
  console.log('Initializing database schema in Neon...');

  try {
    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create recommendations table
    await sql`
      CREATE TABLE IF NOT EXISTS recommendations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_by_user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        streamer TEXT,
        content_type TEXT,
        genre_or_topic TEXT,
        short_blurb TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✓ Recommendations table ensured');

    // Create reactions table
    await sql`
      CREATE TABLE IF NOT EXISTS reactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recommendation_id UUID REFERENCES recommendations(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        status TEXT DEFAULT 'in_my_queue',
        taco_rating INTEGER,
        more_like_this BOOLEAN DEFAULT FALSE,
        hot_take_raw TEXT,
        hot_take_clean TEXT,
        hot_take_source_type TEXT DEFAULT 'text',
        reveal_ready BOOLEAN DEFAULT FALSE,
        reveal_viewed_by_other_user BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(recommendation_id, user_id)
      )
    `;
    console.log('✓ Reactions table ensured');

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recommendation_id UUID REFERENCES recommendations(id) ON DELETE CASCADE,
        target_user_id TEXT NOT NULL,
        notification_type TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✓ Notifications table ensured');

    console.log('\nDatabase setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
