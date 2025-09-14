'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EventDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingType, setBookingType] = useState<'normal' | 'premium'>('normal');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: params.id,
          type: bookingType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking confirmed successfully!');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage(data.error || 'Failed to book event');
      }
    } catch (error) {
      setMessage('An error occurred while booking');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate} at {formattedTime}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Your Spot</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                onClick={() => setBookingType('normal')}
                className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
                  bookingType === 'normal'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">Normal Booking</h3>
                <p className="text-gray-600">Standard event access</p>
                <p className="text-2xl font-bold mt-2 text-indigo-600">Free</p>
              </div>
              
              <div
                onClick={() => setBookingType('premium')}
                className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
                  bookingType === 'premium'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">Premium Booking</h3>
                <p className="text-gray-600">VIP access with special perks</p>
                <p className="text-2xl font-bold mt-2 text-purple-600">Premium</p>
              </div>
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={booking}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
                booking
                  ? 'bg-gray-400 cursor-not-allowed'
                  : bookingType === 'premium'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {booking ? 'Processing...' : `Book ${bookingType === 'premium' ? 'Premium' : 'Normal'} Ticket`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}