import { createClient } from '@libsql/client'

// Local dev: file:data/proraider.db  |  Production: TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:data/proraider.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function initDb() {
  await client.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS market_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        offer_item_name TEXT NOT NULL,
        offer_item_rarity TEXT NOT NULL DEFAULT 'Common',
        offer_quantity INTEGER NOT NULL DEFAULT 1,
        want_item_name TEXT NOT NULL,
        want_item_rarity TEXT NOT NULL DEFAULT 'Common',
        want_quantity INTEGER NOT NULL DEFAULT 1,
        note TEXT,
        contact TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user1_id INTEGER NOT NULL,
        user2_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user1_id, user2_id),
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        read INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      args: [],
    },
  ], 'write')
}

// Run once on startup (no-op if tables already exist)
initDb().catch(console.error)

// ── Types ─────────────────────────────────────────────────────────────────────

export type User = {
  id: number
  username: string
  email: string
  password: string
  created_at: string
}

export type MarketListing = {
  id: number
  user_id: number
  username: string
  offer_item_name: string
  offer_item_rarity: string
  offer_quantity: number
  want_item_name: string
  want_item_rarity: string
  want_quantity: number
  note: string | null
  contact: string
  created_at: string
}

export type ConversationMeta = {
  id: number
  other_user_id: number
  other_username: string
  last_message: string | null
  last_message_at: string | null
  unread_count: number
}

export type ChatMessage = {
  id: number
  conversation_id: number
  sender_id: number
  sender_username: string
  content: string
  read: number
  created_at: string
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function createUser(username: string, email: string, hashedPassword: string) {
  return client.execute({
    sql: 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    args: [username, email, hashedPassword],
  })
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const res = await client.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })
  return res.rows[0] as unknown as User | undefined
}

export async function getUserById(id: number): Promise<User | undefined> {
  const res = await client.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] })
  return res.rows[0] as unknown as User | undefined
}

export async function updateUsername(id: number, username: string) {
  return client.execute({ sql: 'UPDATE users SET username = ? WHERE id = ?', args: [username, id] })
}

export async function updateEmail(id: number, email: string) {
  return client.execute({ sql: 'UPDATE users SET email = ? WHERE id = ?', args: [email, id] })
}

export async function updatePassword(id: number, hashedPassword: string) {
  return client.execute({ sql: 'UPDATE users SET password = ? WHERE id = ?', args: [hashedPassword, id] })
}

// ── Market listings ───────────────────────────────────────────────────────────

export async function createListing(
  userId: number, username: string,
  offerItemName: string, offerItemRarity: string, offerQuantity: number,
  wantItemName: string, wantItemRarity: string, wantQuantity: number,
  note: string | null, contact: string,
) {
  return client.execute({
    sql: `INSERT INTO market_listings
      (user_id, username, offer_item_name, offer_item_rarity, offer_quantity,
       want_item_name, want_item_rarity, want_quantity, note, contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, username, offerItemName, offerItemRarity, offerQuantity,
           wantItemName, wantItemRarity, wantQuantity, note, contact],
  })
}

export async function getListings(search?: string): Promise<MarketListing[]> {
  if (search) {
    const res = await client.execute({
      sql: `SELECT * FROM market_listings WHERE offer_item_name LIKE ? OR want_item_name LIKE ? ORDER BY created_at DESC`,
      args: [`%${search}%`, `%${search}%`],
    })
    return res.rows as unknown as MarketListing[]
  }
  const res = await client.execute({ sql: 'SELECT * FROM market_listings ORDER BY created_at DESC', args: [] })
  return res.rows as unknown as MarketListing[]
}

export async function getListingsByUser(userId: number): Promise<MarketListing[]> {
  const res = await client.execute({
    sql: 'SELECT * FROM market_listings WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  })
  return res.rows as unknown as MarketListing[]
}

export async function deleteListing(id: number, userId: number) {
  return client.execute({
    sql: 'DELETE FROM market_listings WHERE id = ? AND user_id = ?',
    args: [id, userId],
  })
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export async function getOrCreateConversation(userId: number, otherUserId: number): Promise<number> {
  const u1 = Math.min(userId, otherUserId)
  const u2 = Math.max(userId, otherUserId)
  const existing = await client.execute({
    sql: 'SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ?',
    args: [u1, u2],
  })
  if (existing.rows[0]) return (existing.rows[0] as unknown as { id: number }).id
  const result = await client.execute({
    sql: 'INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)',
    args: [u1, u2],
  })
  return Number(result.lastInsertRowid)
}

export async function getConversationsForUser(userId: number): Promise<ConversationMeta[]> {
  const res = await client.execute({
    sql: `SELECT
      c.id,
      CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END AS other_user_id,
      u.username AS other_username,
      (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
      (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_at,
      (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND read = 0) AS unread_count
    FROM conversations c
    JOIN users u ON u.id = CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END
    WHERE c.user1_id = ? OR c.user2_id = ?
    ORDER BY COALESCE(
      (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1),
      c.created_at
    ) DESC`,
    args: [userId, userId, userId, userId, userId],
  })
  return res.rows as unknown as ConversationMeta[]
}

export async function getMessagesForConversation(convId: number, userId: number): Promise<ChatMessage[]> {
  await client.execute({
    sql: 'UPDATE messages SET read = 1 WHERE conversation_id = ? AND sender_id != ?',
    args: [convId, userId],
  })
  const res = await client.execute({
    sql: `SELECT m.id, m.conversation_id, m.sender_id, u.username AS sender_username, m.content, m.read, m.created_at
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC`,
    args: [convId],
  })
  return res.rows as unknown as ChatMessage[]
}

export async function insertMessage(convId: number, senderId: number, content: string) {
  return client.execute({
    sql: 'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
    args: [convId, senderId, content],
  })
}

export async function getTotalUnread(userId: number): Promise<number> {
  const res = await client.execute({
    sql: `SELECT COUNT(*) AS n FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE (c.user1_id = ? OR c.user2_id = ?) AND m.sender_id != ? AND m.read = 0`,
    args: [userId, userId, userId],
  })
  return Number((res.rows[0] as unknown as { n: number }).n)
}

export async function conversationBelongsToUser(convId: number, userId: number): Promise<boolean> {
  const res = await client.execute({
    sql: 'SELECT id FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
    args: [convId, userId, userId],
  })
  return res.rows.length > 0
}
