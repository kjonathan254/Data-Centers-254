import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

interface Subscriber {
  email: string;
  source: string;
  status: 'Active' | 'Unsubscribed';
  subscribedAt: string;
  updatedAt: string;
}

function readSubscribers(): Subscriber[] {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeSubscribers(subs: Subscriber[]) {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    const subs = readSubscribers();
    const now = new Date().toISOString();

    const existing = subs.find((s) => s.email === normalized);

    if (existing) {
      if (existing.status === 'Active') {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      existing.status = 'Active';
      existing.updatedAt = now;
      writeSubscribers(subs);
      return NextResponse.json({ message: 'Welcome back — you are subscribed' }, { status: 200 });
    }

    subs.push({
      email: normalized,
      source: source || 'homepage',
      status: 'Active',
      subscribedAt: now,
      updatedAt: now,
    });
    writeSubscribers(subs);

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
