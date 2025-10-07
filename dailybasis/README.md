# Daily Basis - Mess Management System

A simple mess management system built with Next.js, Prisma, and NextAuth for tracking daily attendance and meals.

## Features

- **User Authentication**: Sign up and sign in with email/password
- **Role-based Access**: Admin and User roles
- **Daily Attendance**: Users can mark themselves as present or absent
- **Regular Attendee**: Users can set themselves as regular (no need to update daily)
- **Admin Dashboard**: View attending students and set daily meal descriptions
- **Automatic Daily Reset**: Attendance resets daily based on regular status

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dailybasis
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dailybasis"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Set up sample data
npm run db:setup
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Default Credentials

After running `npm run db:setup`:

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Usage

### For Users
1. Sign up with your email and password
2. After login, you'll see your dashboard
3. Mark yourself as Present or Absent for today
4. Optionally, check "Regular Attendee" to automatically be marked present daily
5. View today's meal description (if set by admin)

### For Admins
1. Admin role must be set manually in the database
2. View list of students attending today
3. Set daily meal descriptions
4. Monitor overall attendance

## Database Schema

- **User**: id, name, email, password, role, attending, isRegular, lastUpdate
- **Meal**: id, date, description
- **Role**: USER, ADMIN

## API Endpoints

- `POST /api/attendance` - Update user attendance
- `POST /api/regular` - Update regular status
- `GET/POST /api/auth/[...nextauth]` - Authentication endpoints

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:setup` - Set up sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
