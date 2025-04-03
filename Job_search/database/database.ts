import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('bookmarks.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL
    );
  `);
};

export const addBookmark = async (job) => {
  if (!db) db = await SQLite.openDatabaseAsync('bookmarks.db');
  await db.runAsync(
    `INSERT OR REPLACE INTO bookmarks (id, data) VALUES (?, ?);`,
    [job.id, JSON.stringify(job)]
  );
};

export const removeBookmark = async (jobId) => {
  if (!db) db = await SQLite.openDatabaseAsync('bookmarks.db');
  await db.runAsync(`DELETE FROM bookmarks WHERE id = ?;`, [jobId]);
};

export const getBookmarks = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('bookmarks.db');
  const result = await db.getAllAsync(`SELECT * FROM bookmarks;`);
  return result.map(row => JSON.parse(row.data));
};
