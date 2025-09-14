# Evently - Event Management Web App

A modern event management platform built with Next.js, MongoDB, and NextAuth.js.

## Features

- 🎫 Event browsing and booking
- 👥 User authentication (register/login)
- 🎯 Two booking types: Normal and Premium
- 👨‍💼 Admin dashboard for event and booking management
- 📱 Responsive design with Tailwind CSS
- 🔐 Secure authentication with NextAuth.js

## Tech Stack

- **Frontend**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   cd evently
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/evently
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   ```

4. **Seed the admin user**
   ```bash
   npm run seed:admin
   ```
   
   This creates an admin user with:
   - Email: `admin@evently.com`
   - Password: `admin123`
   
   ⚠️ **Important**: Change the admin password after first login!

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Credentials

**Admin User:**
- Email: `admin@evently.com`
- Password: `admin123`

## Available Routes

- `/` - Landing page with event listings
- `/events/[id]` - Event details and booking page
- `/auth/login` - User login
- `/auth/register` - User registration
- `/dashboard` - Admin dashboard (admin only)

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/events` - List all events
- `POST /api/events` - Create event (admin only)
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event (admin only)
- `DELETE /api/events/[id]` - Delete event (admin only)
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking

## Project Structure

```
evently/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   └── events/            # Event pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configs
├── models/                # Mongoose models
├── scripts/               # Utility scripts
└── types/                 # TypeScript type definitions
```

## Development Notes

- The app uses Next.js App Router for modern React features
- All API routes are protected with appropriate authentication
- Admin routes are protected with middleware
- MongoDB connection is handled with connection pooling
- Passwords are hashed using bcryptjs

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Email confirmations
- Advanced search and filtering
- Event categories
- User profiles
- Event images
- Notification system