import { type User, type InsertUser, type WaitlistEntry, type InsertWaitlistEntry, type DemoBooking, type InsertDemoBooking } from "@shared/schema";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for persistent storage");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function ensureTablesExist() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        business_url TEXT,
        tier_interest TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS demo_bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        business_name TEXT NOT NULL,
        purpose TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    console.log("Supabase tables verified/created: waitlist_entries, demo_bookings");
  } catch (err: any) {
    console.error("Failed to create tables:", err.message);
  } finally {
    client.release();
  }
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking>;
  getDemoBookings(): Promise<DemoBooking[]>;
}

export class SupabaseStorage implements IStorage {
  private users: Map<string, User>;
  private initialized: Promise<void>;

  constructor() {
    this.users = new Map();
    this.initialized = ensureTablesExist();
  }

  private async waitForInit() {
    await this.initialized;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    await this.waitForInit();

    const result = await pool.query(
      `INSERT INTO waitlist_entries (name, email, business_url, tier_interest)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [entry.name, entry.email, entry.businessUrl || null, entry.tierInterest]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      businessUrl: row.business_url,
      tierInterest: row.tier_interest,
      createdAt: new Date(row.created_at),
    };
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    await this.waitForInit();

    const result = await pool.query(
      `SELECT * FROM waitlist_entries ORDER BY created_at DESC`
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      businessUrl: row.business_url,
      tierInterest: row.tier_interest,
      createdAt: new Date(row.created_at),
    }));
  }

  async createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking> {
    await this.waitForInit();

    const result = await pool.query(
      `INSERT INTO demo_bookings (name, phone, email, business_name, purpose, date, time)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [booking.name, booking.phone, booking.email, booking.businessName, booking.purpose, booking.date, booking.time]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      businessName: row.business_name,
      purpose: row.purpose,
      date: row.date,
      time: row.time,
      createdAt: new Date(row.created_at),
    };
  }

  async getDemoBookings(): Promise<DemoBooking[]> {
    await this.waitForInit();

    const result = await pool.query(
      `SELECT * FROM demo_bookings ORDER BY created_at DESC`
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      businessName: row.business_name,
      purpose: row.purpose,
      date: row.date,
      time: row.time,
      createdAt: new Date(row.created_at),
    }));
  }
}

export const storage = new SupabaseStorage();
