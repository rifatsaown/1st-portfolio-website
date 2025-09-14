import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectMongoDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';

// GET all events
export async function GET() {
  try {
    await connectMongoDB();
    
    const events = await Event.find({})
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, date, location } = await request.json();

    if (!title || !description || !date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      createdBy: session.user.id,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}