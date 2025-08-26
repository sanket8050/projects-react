# Statusly - Shop Status Management App

A modern web application where local shops, restaurants, and businesses can publish their live status, today's menu, and available items. Customers can browse nearby shops, view details, and search/filter using geolocation.

## 🚀 Features

### Customer Features
- **Geolocation-based Shop Discovery**: Find shops near your location
- **Real-time Status Updates**: See live open/closed status
- **Menu Browsing**: View today's menu with prices and availability
- **Search & Filter**: Search by shop name or menu items, filter by type
- **Shop Details**: View contact information, announcements, and last updated timestamps
- **Responsive Design**: Works perfectly on mobile and desktop

### Owner Features
- **Dashboard Management**: Toggle shop status, update menu, and announcements
- **Real-time Updates**: Changes reflect instantly across all customers
- **Menu Management**: Add, remove, and toggle availability of menu items
- **Announcements**: Share updates and special offers with customers
- **Mobile-Friendly**: Manage your shop on the go

### Technical Features
- **Real-time Updates**: Socket.IO for instant status and menu updates
- **Authentication**: JWT-based authentication with role-based access
- **Geolocation**: Distance calculation and nearby shop discovery
- **Modern UI**: Tailwind CSS with smooth animations and responsive design
- **API-First**: RESTful API with comprehensive endpoints

## 🛠 Tech Stack

### Frontend
- **React 18+** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router DOM** for client-side routing
- **React Hook Form** for form management
- **Axios** for API communication
- **Socket.IO Client** for real-time updates

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
statusly/
├── src/                          # React frontend
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Button.jsx
│   │   │   └── Modal.jsx
│   │   ├── ShopCard.jsx         # Shop preview card
│   │   ├── ShopList.jsx         # Shop listing with filters
│   │   ├── ShopDetail.jsx       # Detailed shop view
│   │   └── StatusToggle.jsx     # Open/closed toggle
│   ├── pages/
│   │   ├── Home.jsx             # Main customer page
│   │   ├── ShopPage.jsx         # Individual shop page
│   │   ├── OwnerDashboard.jsx   # Owner management
│   │   ├── Login.jsx            # Authentication
│   │   └── NotFound.jsx         # 404 page
│   ├── hooks/
│   │   └── useNearbyShops.jsx   # Geolocation hook
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state
│   ├── services/
│   │   └── api.jsx              # API service
│   ├── utils/
│   │   └── helpers.jsx          # Utility functions
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # App entry point
├── server/                      # Express backend
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Shop.js              # Shop schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── shops.js             # Shop management routes
│   ├── index.js                 # Server entry point
│   └── package.json
├── package.json                 # Frontend dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd statusly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your backend URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/statusly
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Backend will be available at `http://localhost:5000`

## 📱 Usage

### For Customers
1. Visit the homepage and allow location access
2. Browse nearby shops or use search/filter
3. Click on a shop to view detailed information
4. View menu, contact details, and announcements
5. Use contact buttons to call or WhatsApp the shop

### For Shop Owners
1. Sign up with "Owner" role
2. Log in to access the dashboard
3. Toggle shop status (open/closed)
4. Add/remove menu items with prices and notes
5. Update announcements for customers
6. All changes update in real-time

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Shops
- `GET /api/shops` - Get nearby shops with filters
- `GET /api/shops/:id` - Get shop details
- `POST /api/shops` - Create new shop (owner only)
- `PUT /api/shops/:id` - Update shop (owner only)
- `PUT /api/shops/:id/status` - Update shop status
- `PUT /api/shops/:id/menu` - Update shop menu
- `PUT /api/shops/:id/announcement` - Update announcement

## 🎨 UI Components

### Reusable Components
- **Button**: Multiple variants (primary, secondary, danger, outline, ghost)
- **Modal**: Animated modal with backdrop and keyboard support
- **StatusToggle**: Smooth toggle for open/closed status

### Shop Components
- **ShopCard**: Hover effects, status badges, menu preview
- **ShopList**: Search, filter, and grid layout
- **ShopDetail**: Comprehensive shop information with menu table

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Protected routes

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic scaling

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGO_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@statusly.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Socket.IO for real-time communication
- MongoDB for the flexible database solution

---

**Statusly** - Making local business discovery and management simple and real-time! 🚀
