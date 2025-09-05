# 🎯 OMR Answer Sheet Checker

A complete MERN stack application with Python AI integration for automated OMR (Optical Mark Recognition) sheet processing and scoring.

## ✨ Features

- **📝 Answer Key Management**: Upload Excel files with question-answer pairs
- **📊 OMR Processing**: AI-powered bubble detection using OpenCV
- **🎯 Automated Scoring**: Compare student answers with answer keys
- **📈 Results Dashboard**: View scores, statistics, and rankings
- **📥 Excel Export**: Download results in Excel format
- **🔒 Data Validation**: Prevent duplicate submissions and ensure data integrity

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Axios** for API communication
- **Modern CSS** with responsive design

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **XLSX** for Excel file processing

### AI/ML Service
- **Python 3.8+** with FastAPI
- **OpenCV** for image processing
- **NumPy** for numerical operations
- **PIL** for image manipulation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd OMR
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../server
npm install
```

#### Python Service
```bash
cd ../python-service
pip install -r requirements.txt
```

### 3. Environment Setup

#### Backend (.env file in server directory)
```bash
cd ../server
cp env.example .env
# Edit .env with your MongoDB connection string
```

#### Python Service
```bash
cd ../python-service
# No additional environment setup needed for MVP
```

### 4. Start Services

#### Terminal 1: MongoDB
```bash
# Start MongoDB (if running locally)
mongod
```

#### Terminal 2: Backend Server
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

#### Terminal 3: Python Service
```bash
cd python-service
python app.py
# Python service will run on http://localhost:5001
```

#### Terminal 4: Frontend
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

## 📁 Project Structure

```
OMR/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # Entry point
│   └── package.json
├── server/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── uploads/            # File upload directory
│   └── index.js            # Server entry point
├── python-service/          # Python AI service
│   ├── app.py              # FastAPI application
│   ├── omr_processor.py    # OMR processing logic
│   └── requirements.txt    # Python dependencies
└── README.md
```

## 🔧 API Endpoints

### Answer Key Management
- `POST /api/answerkey/upload` - Upload Excel answer key

### OMR Processing
- `POST /api/omr/process` - Process OMR image
- `POST /api/score/process` - Process OMR and calculate score

### Results
- `GET /api/results/:examId` - Get exam results
- `GET /api/results/:examId/export` - Export results to Excel

## 📊 Excel Format Requirements

### Answer Key Format
Your Excel file should have columns:
- **Question**: Question identifier (e.g., Q1, Q2, Question 1)
- **Answer**: Correct answer (A, B, C, D)

Example:
| Question | Answer |
|----------|--------|
| Q1       | B      |
| Q2       | C      |
| Q3       | A      |

## 🎯 How It Works

1. **Upload Answer Key**: School uploads Excel file with correct answers
2. **Process OMR**: Student OMR sheets are scanned and uploaded
3. **AI Detection**: Python service detects filled bubbles using OpenCV
4. **Automated Scoring**: System compares student answers with answer key
5. **Results**: View scores, rankings, and export to Excel

## 🔮 Future Enhancements

- **Authentication**: Admin login for schools
- **Bulk Upload**: Process multiple OMR sheets at once
- **Advanced AI**: Machine learning for better bubble detection
- **Negative Marking**: Configurable scoring schemes
- **PDF Reports**: Auto-generated student reports
- **Real-time Updates**: WebSocket integration for live scoring

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **Python Service Not Responding**
   - Verify Python dependencies are installed
   - Check if port 5001 is available

3. **File Upload Issues**
   - Ensure uploads/ directory exists
   - Check file size limits

4. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API endpoints

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=true
NODE_ENV=development
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for educational institutions**
