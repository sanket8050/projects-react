# Statusly - Local Business Status Platform

A MERN stack application where local businesses can publish their live status, menus, and announcements while customers can discover and browse nearby shops.

## Features

- **Customer Features:**
  - Browse nearby shops with geolocation
  - Search and filter by business type
  - View live status, menus, and announcements
  - Real-time updates via Socket.IO

- **Owner Features:**
  - Manage shop status (Open/Closed)
  - Update menu items and prices
  - Post announcements
  - Mobile-friendly dashboard

## Tech Stack

- **Frontend:** React 18+ (Vite), Tailwind CSS, React Router, React Hook Form
- **Backend:** Node.js, Express.js, MongoDB, Socket.IO
- **Authentication:** JWT tokens
- **Real-time:** Socket.IO for live updates

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies:**
   \`\`\`bash
   git clone <repository-url>
   cd statusly
   npm run install-deps
   \`\`\`

2. **Environment Setup:**
   \`\`\`bash
   # Client environment
   cp client/.env.example client/.env
   
   # Server environment  
   cp server/.env.example server/.env
   \`\`\`

3. **Configure environment variables:**
   - Update `server/.env` with your MongoDB URI and JWT secret
   - Update `client/.env` if using different ports

4. **Start development servers:**
   \`\`\`bash
   npm run dev
   \`\`\`

   This runs both client (http://localhost:3000) and server (http://localhost:5000)

### Individual Commands

\`\`\`bash
# Client only
cd client && npm run dev

# Server only  
cd server && npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
statusly/
├── client/          # React frontend (Vite)
├── server/          # Express backend
├── package.json     # Root package with scripts
└── README.md
\`\`\`

## API Endpoints

- `GET /api/shops` - Get nearby shops with filters
- `GET /api/shops/:id` - Get shop details
- `POST /api/shops` - Create shop (owner only)
- `PUT /api/shops/:id` - Update shop (owner only)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

## Deployment

- **Frontend:** Deploy to Vercel
- **Backend:** Deploy to Render or Railway
- **Database:** MongoDB Atlas for production
