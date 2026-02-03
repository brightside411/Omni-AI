import { type User, type InsertUser, type WaitlistEntry, type InsertWaitlistEntry, type DemoBooking, type InsertDemoBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking>;
  getDemoBookings(): Promise<DemoBooking[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private waitlistEntries: Map<string, WaitlistEntry>;
  private demoBookings: Map<string, DemoBooking>;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.demoBookings = new Map();
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
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = randomUUID();
    const waitlistEntry: WaitlistEntry = {
      ...entry,
      id,
      businessUrl: entry.businessUrl || null,
      createdAt: new Date(),
    };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking> {
    const id = randomUUID();
    const demoBooking: DemoBooking = {
      ...booking,
      id,
      createdAt: new Date(),
    };
    this.demoBookings.set(id, demoBooking);
    return demoBooking;
  }

  async getDemoBookings(): Promise<DemoBooking[]> {
    return Array.from(this.demoBookings.values());
  }
}

export const storage = new MemStorage();
