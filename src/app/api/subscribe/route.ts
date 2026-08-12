import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return NextResponse.json(
        { error: 'Enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed (active)
    const existing = await db.subscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      if (existing.status === 'Active') {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 200 }
        );
      }
      // Re-activate previously unsubscribed
      await db.subscriber.update({
        where: { email: normalized },
        data: { status: 'Active', updatedAt: new Date() },
      });
      return NextResponse.json(
        { message: 'Welcome back — you are subscribed' },
        { status: 200 }
      );
    }

    // Create subscriber
    await db.subscriber.create({
      data: {
        email: normalized,
        source: source || 'homepage',
        status: 'Active',
      },
    });

    return NextResponse.json(
      { message: 'Subscribed' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
