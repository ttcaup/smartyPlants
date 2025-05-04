import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('smartyPlants');
    const plant = await db
      .collection('plants')
      .findOne({ plant_link: params.plant });
    console.log(plant);
    return NextResponse.json(plant);
  } catch (err) {
    console.error(`GET /api/plants/${params.plant} error:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch plant' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('smartyPlants');
    await db
      .collection('plants')
      .updateOne({ plant_link: params.plant }, { $set: body });
    return NextResponse.json({ message: 'Plant updated' });
  } catch (err) {
    console.error(`PUT /api/plants/${params.plant} error:`, err);
    return NextResponse.json(
      { error: 'Failed to update plant' },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('smartyPlants');
    await db.collection('plants').deleteOne({ plant_link: params.plant });
    return NextResponse.json({ message: 'Plant deleted' });
  } catch (err) {
    console.error(`DELETE /api/plants/${params.plant} error:`, err);
    return NextResponse.json(
      { error: 'Failed to delete plant' },
      { status: 500 }
    );
  }
}
