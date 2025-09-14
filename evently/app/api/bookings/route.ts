import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectMongoDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';

// GET bookings (admin only can see all bookings)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    let query: any = {};

    // Admin can see all bookings, users can only see their own
    if (session.user.role !== 'admin') {
      query.userId = session.user.id;
    }

    if (eventId) {
      query.eventId = eventId;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('eventId', 'title date location')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to book an event' },
        { status: 401 }
      );
    }

    const { eventId, type } = await request.json();

    if (!eventId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['normal', 'premium'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid booking type' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user already booked this event
    const existingBooking = await Booking.findOne({
      userId: session.user.id,
      eventId,
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this event' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      userId: session.user.id,
      eventId,
      type,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('eventId', 'title date location');

    return NextResponse.json(populatedBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}