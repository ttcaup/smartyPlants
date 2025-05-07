/* app\api\readings\route.js*/
/*manages readings for all plants*/
import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('smartyPlants');
    const readings = await db
      .collection('readings')
      .aggregate([
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$plant_info.plant_link',
            latestReading: { $first: '$$ROOT' },
          },
        },
      ])
      .toArray();
    console.log(readings);
    return NextResponse.json(readings);
  } catch (err) {
    console.error('GET /api/readings error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}
