import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('smartyPlants');
    const plants = await db.collection('plants').find({}).toArray();
    console.log(plants);
    return NextResponse.json(plants);
  } catch (err) {
    console.error('GET /api/plants error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch plants' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('smartyPlants');
    await db.collection('plants').insertOne(body);
    return NextResponse.json({ message: 'Plant added' });
  } catch (err) {
    console.error('POST /api/plants error:', err);
    return NextResponse.json({ error: 'Failed to add plant' }, { status: 500 });
  }
}
