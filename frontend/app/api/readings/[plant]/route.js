/*api\readings\[plant]\route.js*/
/*manages sensor readings for a specific plant*/
import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('smartyPlants');

    const data = await db
      .collection('readings')
      .find({ 'plant_info.plant_link': params.plant })
      .sort({ timestamp: -1 })
      .toArray();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`GET /api/readings/${params.plant} error:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch plant readings' },
      { status: 500 }
    );
  }
}
