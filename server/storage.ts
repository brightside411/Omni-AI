import { type User, type InsertUser, type WaitlistEntry, type InsertWaitlistEntry, type DemoBooking, type InsertDemoBooking, type WebinarRegistration, type InsertWebinarRegistration, type AdminUser, type InsertAdminUser, type Profile, type InsertProfile } from "@shared/schema";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not provided - using in-memory storage");
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
        phone TEXT NOT NULL,
        purpose TEXT NOT NULL,
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS webinar_registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        session_date TEXT NOT NULL,
        session_time TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        is_sponsor BOOLEAN NOT NULL DEFAULT FALSE,
        tier INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    console.log("Supabase tables verified/created: waitlist_entries, demo_bookings, webinar_registrations, admin_users, profiles");
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
  createWebinarRegistration(registration: InsertWebinarRegistration): Promise<WebinarRegistration>;
  getWebinarRegistrations(): Promise<WebinarRegistration[]>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  getAdminUsers(): Promise<AdminUser[]>;
  isAdminEmail(email: string): Promise<boolean>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfile(email: string): Promise<Profile | undefined>;
  updateProfile(email: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
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
      `INSERT INTO waitlist_entries (name, email, phone, purpose)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [entry.name, entry.email, entry.phone, entry.purpose]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      purpose: row.purpose,
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
      phone: row.phone,
      purpose: row.purpose,
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
  async createWebinarRegistration(registration: InsertWebinarRegistration): Promise<WebinarRegistration> {
    await this.waitForInit();

    const result = await pool.query(
      `INSERT INTO webinar_registrations (first_name, last_name, email, phone, session_date, session_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [registration.firstName, registration.lastName, registration.email, registration.phone, registration.sessionDate, registration.sessionTime]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      sessionDate: row.session_date,
      sessionTime: row.session_time,
      createdAt: new Date(row.created_at),
    };
  }

  async getWebinarRegistrations(): Promise<WebinarRegistration[]> {
    await this.waitForInit();

    const result = await pool.query(
      `SELECT * FROM webinar_registrations ORDER BY created_at DESC`
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      sessionDate: row.session_date,
      sessionTime: row.session_time,
      createdAt: new Date(row.created_at),
    }));
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    await this.waitForInit();

    const result = await pool.query(
      `INSERT INTO admin_users (email) VALUES ($1) RETURNING *`,
      [adminUser.email]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      createdAt: new Date(row.created_at),
    };
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    await this.waitForInit();

    const result = await pool.query(`SELECT * FROM admin_users ORDER BY created_at DESC`);

    return result.rows.map((row: any) => ({
      id: row.id,
      email: row.email,
      createdAt: new Date(row.created_at),
    }));
  }

  async isAdminEmail(email: string): Promise<boolean> {
    await this.waitForInit();

    const result = await pool.query(
      `SELECT 1 FROM admin_users WHERE email = $1`,
      [email]
    );

    return result.rows.length > 0;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    await this.waitForInit();

    const result = await pool.query(
      `INSERT INTO profiles (email, is_sponsor, tier) VALUES ($1, $2, $3) RETURNING *`,
      [profile.email, profile.isSponsor, profile.tier]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      isSponsor: row.is_sponsor,
      tier: row.tier,
      createdAt: new Date(row.created_at),
    };
  }

  async getProfile(email: string): Promise<Profile | undefined> {
    await this.waitForInit();

    const result = await pool.query(
      `SELECT * FROM profiles WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) return undefined;

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      isSponsor: row.is_sponsor,
      tier: row.tier,
      createdAt: new Date(row.created_at),
    };
  }

  async updateProfile(email: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    await this.waitForInit();

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (profile.isSponsor !== undefined) {
      updates.push(`is_sponsor = $${paramIndex++}`);
      values.push(profile.isSponsor);
    }
    if (profile.tier !== undefined) {
      updates.push(`tier = $${paramIndex++}`);
      values.push(profile.tier);
    }

    if (updates.length === 0) return this.getProfile(email);

    values.push(email);
    const result = await pool.query(
      `UPDATE profiles SET ${updates.join(", ")} WHERE email = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return undefined;

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      isSponsor: row.is_sponsor,
      tier: row.tier,
      createdAt: new Date(row.created_at),
    };
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private waitlistEntries: Map<string, WaitlistEntry> = new Map();
  private demoBookings: Map<string, DemoBooking> = new Map();
  private webinarRegistrations: Map<string, WebinarRegistration> = new Map();
  private adminUsers: Map<string, AdminUser> = new Map();
  private profiles: Map<string, Profile> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = crypto.randomUUID();
    const waitlistEntry: WaitlistEntry = { ...entry, id, createdAt: new Date() };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values()).reverse();
  }

  async createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking> {
    const id = crypto.randomUUID();
    const newBooking: DemoBooking = { ...booking, id, createdAt: new Date() };
    this.demoBookings.set(id, newBooking);
    return newBooking;
  }

  async getDemoBookings(): Promise<DemoBooking[]> {
    return Array.from(this.demoBookings.values()).reverse();
  }

  async createWebinarRegistration(registration: InsertWebinarRegistration): Promise<WebinarRegistration> {
    const id = crypto.randomUUID();
    const newRegistration: WebinarRegistration = { ...registration, id, createdAt: new Date() };
    this.webinarRegistrations.set(id, newRegistration);
    return newRegistration;
  }

  async getWebinarRegistrations(): Promise<WebinarRegistration[]> {
    return Array.from(this.webinarRegistrations.values()).reverse();
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const id = crypto.randomUUID();
    const newAdminUser: AdminUser = { ...adminUser, id, createdAt: new Date() };
    this.adminUsers.set(id, newAdminUser);
    return newAdminUser;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values()).reverse();
  }

  async isAdminEmail(email: string): Promise<boolean> {
    return Array.from(this.adminUsers.values()).some((admin) => admin.email === email);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = crypto.randomUUID();
    const newProfile: Profile = { 
      ...profile, 
      id, 
      isSponsor: profile.isSponsor ?? false,
      tier: profile.tier ?? 0,
      createdAt: new Date() 
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async getProfile(email: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find((p) => p.email === email);
  }

  async updateProfile(email: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = await this.getProfile(email);
    if (!existing) return undefined;
    
    const updated: Profile = { ...existing, ...profile };
    this.profiles.set(existing.id, updated);
    return updated;
  }
}

const useMemoryStorage = !process.env.DATABASE_URL;

if (useMemoryStorage) {
  console.log("Using in-memory storage (no DATABASE_URL provided)");
} else {
  console.log("Using PostgreSQL storage");
}

export const storage = useMemoryStorage ? new MemStorage() : new SupabaseStorage();
