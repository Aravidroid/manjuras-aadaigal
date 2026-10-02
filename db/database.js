/**
 * db/database.js — Turso/libSQL client
 * Singleton — connect once, reuse across the app.
 */
const { createClient } = require('@libsql/client');

let client;

function getDb() {
  if (!client) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('TURSO_DATABASE_URL is not set in .env');
    }
    client = createClient({
      url:       process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

module.exports = { getDb };
