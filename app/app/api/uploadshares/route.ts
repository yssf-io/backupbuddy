import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

const redis = new Redis(process.env.REDIS_ENDPOINT || 'redis://localhost:6379');

const SHARES_KEY = 'shares';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming request body
    const body = await request.json();
    const shares: string[] = body.shares;

    // 2. Validate the input
    if (!Array.isArray(shares) || shares.length === 0) {
      return NextResponse.json({ error: 'Invalid input: "shares" must be a non-empty array.' }, { status: 400 });
    }

    // 3. Prepare new shares with unique IDs
    const newSharesData: { [id: string]: string } = {};
    const newShareIds: string[] = [];

    for (const shareValue of shares) {
      const shareId = randomUUID(); // Generate a unique ID for each share
      newSharesData[shareId] = shareValue;
      newShareIds.push(shareId);
    }

    // 4. Get existing shares from Redis and merge with new ones
    const existingSharesRaw = await redis.get(SHARES_KEY);
    const existingShares = existingSharesRaw ? JSON.parse(existingSharesRaw) : {};

    const updatedShares = { ...existingShares, ...newSharesData };

    // 5. Save the updated object back to Redis
    // We use PX for an expiry time in milliseconds (e.g., 24 hours) to prevent old data from accumulating forever.
    // Remove 'PX', 86400000 if you want the data to persist indefinitely.
    await redis.set(SHARES_KEY, JSON.stringify(updatedShares));

    console.log(`Successfully stored ${newShareIds.length} new shares.`);

    // 6. Return the new IDs to the client
    return NextResponse.json({
      message: 'Shares stored successfully.',
      shareIds: newShareIds
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to store shares:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
