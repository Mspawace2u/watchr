import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.DATABASE_URL;

if (!databaseUrl) {
  if (import.meta.env.DEV) {
    console.warn('DATABASE_URL is not defined. Neon client is uninitialized. Ensure your .env file is set up.');
  }
}

export const sql = neon(databaseUrl || '');

/**
 * Extract the offending column name from a Postgres 42703 (undefined_column) error.
 * Neon + Postgres formats the message as `column "foo" of relation "bar" does not exist`.
 */
function extractMissingColumn(err) {
  const msg = err?.message || '';
  const m = msg.match(/column "([^"]+)"/);
  return m?.[1];
}

/**
 * Schema-drift-tolerant upsert. Builds an INSERT ... ON CONFLICT DO UPDATE
 * statement from a columns map; if Postgres rejects a column (42703), the
 * column is stripped and the write is retried. Never fails the whole write
 * on a single drifted field.
 *
 * @param {object} opts
 * @param {string} opts.table — table name (trusted, not user input)
 * @param {string[]} opts.conflictKeys — columns used in ON CONFLICT (trusted)
 * @param {Record<string, unknown>} opts.columns — column → value
 * @param {boolean} [opts.touchUpdatedAt=true] — include `updated_at = NOW()` on upsert
 * @param {boolean} [opts.returning=true] — append `RETURNING *`
 * @param {string} [opts.updateWhere] — optional SQL fragment appended to the
 *   ON CONFLICT DO UPDATE as `WHERE <updateWhere>`. Lets callers make the
 *   update atomic (e.g. `reactions.reveal_viewed_by_other_user IS NOT TRUE`
 *   for a lock guard). Column names referenced here are NOT auto-dropped by
 *   the 42703 retry — if the referenced column is missing, the upsert throws.
 *   Trusted SQL only — never interpolate user input.
 */
export async function safeUpsert({
  table,
  conflictKeys,
  columns,
  touchUpdatedAt = true,
  returning = true,
  updateWhere = null,
}) {
  const working = { ...columns };
  const maxAttempts = Object.keys(working).length + 1;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const cols = Object.keys(working);
    if (cols.length === 0) {
      throw new Error(`safeUpsert(${table}): no columns left after schema-drift drops`);
    }
    const values = cols.map((c) => working[c]);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const updateAssignments = cols
      .filter((c) => !conflictKeys.includes(c))
      .map((c) => `${c} = EXCLUDED.${c}`);
    if (touchUpdatedAt) updateAssignments.push('updated_at = NOW()');

    const insertCols = touchUpdatedAt ? `${cols.join(', ')}, updated_at` : cols.join(', ');
    const insertVals = touchUpdatedAt ? `${placeholders}, NOW()` : placeholders;
    const whereClause = updateWhere ? `\n      WHERE ${updateWhere}` : '';
    const query = `
      INSERT INTO ${table} (${insertCols})
      VALUES (${insertVals})
      ON CONFLICT (${conflictKeys.join(', ')})
      DO UPDATE SET ${updateAssignments.join(', ')}${whereClause}
      ${returning ? 'RETURNING *' : ''}
    `;

    try {
      return await sql.query(query, values);
    } catch (err) {
      if (err?.code === '42703') {
        const bad = extractMissingColumn(err);
        if (bad && bad in working) {
          console.warn(`[schema-drift] ${table}: dropping "${bad}" and retrying`, err.message);
          delete working[bad];
          continue;
        }
      }
      throw err;
    }
  }
  throw new Error(`safeUpsert(${table}): exceeded retry budget`);
}

/**
 * Schema-drift-tolerant insert. Same contract as safeUpsert but without
 * ON CONFLICT — used for append-only tables (e.g. notifications).
 */
export async function safeInsert({ table, columns, returning = true }) {
  const working = { ...columns };
  const maxAttempts = Object.keys(working).length + 1;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const cols = Object.keys(working);
    if (cols.length === 0) {
      throw new Error(`safeInsert(${table}): no columns left after schema-drift drops`);
    }
    const values = cols.map((c) => working[c]);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      INSERT INTO ${table} (${cols.join(', ')})
      VALUES (${placeholders})
      ${returning ? 'RETURNING *' : ''}
    `;

    try {
      return await sql.query(query, values);
    } catch (err) {
      if (err?.code === '42703') {
        const bad = extractMissingColumn(err);
        if (bad && bad in working) {
          console.warn(`[schema-drift] ${table}: dropping "${bad}" and retrying`, err.message);
          delete working[bad];
          continue;
        }
      }
      throw err;
    }
  }
  throw new Error(`safeInsert(${table}): exceeded retry budget`);
}
