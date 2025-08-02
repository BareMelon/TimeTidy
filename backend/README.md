# TimeTidy Backend API

A Node.js/Express backend API for the TimeTidy employee scheduling and time tracking application.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: CRUD operations for employees, managers, and administrators
- **Shift Management**: Create, update, and delete shifts with filtering
- **Time Tracking**: Check-in/out functionality with location tracking
- **Shift Swaps**: Request and approve shift swaps between employees
- **Time Off Requests**: Submit and approve time off requests
- **Dashboard**: Statistics and pending approvals
- **Location Management**: Multi-location support with geofencing

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet
- **CORS**: Cross-origin resource sharing enabled
- **Logging**: Morgan HTTP request logger

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and mock data
│   └── index.ts         # Main server file
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── nodemon.json         # Development configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Manager+)
- `PUT /api/users/:id` - Update user (Manager+)
- `DELETE /api/users/:id` - Delete user (Manager+)

### Shifts
- `GET /api/shifts` - Get all shifts (with filters)
- `GET /api/shifts/:id` - Get shift by ID
- `POST /api/shifts` - Create new shift (Manager+)
- `PUT /api/shifts/:id` - Update shift (Manager+)
- `DELETE /api/shifts/:id` - Delete shift (Manager+)

### Check-ins
- `GET /api/checkins` - Get all check-ins (with filters)
- `POST /api/checkins` - Check in
- `PUT /api/checkins/:id/checkout` - Check out

### Shift Swaps
- `GET /api/swaps` - Get all swap requests
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/approve` - Approve/reject swap (Manager+)

### Time Off
- `GET /api/timeoff` - Get all time off requests
- `POST /api/timeoff` - Create time off request
- `PUT /api/timeoff/:id/approve` - Approve/reject request (Manager+)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/approvals` - Get pending approvals

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **admin**: Full access to all features
- **manager**: Can manage users, shifts, and approve requests
- **employee**: Can view schedules, check in/out, and request swaps/time off

## 📊 Mock Data

The backend currently uses mock data for demonstration purposes. The mock data includes:

- **Users**: 4 users (admin, manager, 2 employees)
- **Locations**: 2 locations (Copenhagen stores)
- **Shifts**: 10 sample shifts
- **Check-ins**: 2 sample check-ins
- **Shift Swaps**: 2 sample swap requests
- **Time Off Requests**: 3 sample requests

## 🔧 Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Database (for future use)
DATABASE_URL=postgresql://username:password@localhost:5432/timetidy

# Email Configuration (for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

# SMS Configuration (for future use)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## 🧪 Testing

### Demo Credentials

For testing purposes, you can use these credentials:

- **Admin**: `Administrator` / `admin123`
- **Manager**: `jsmith` / `password`
- **Employee**: `jdoe` / `password`
- **Temp Employee**: `guest12345` / `temp123`

## 🔄 API Response Format

All API responses follow this format:

```json
{
  "data": <response-data>,
  "success": true,
  "message": "Success message",
  "errors": {
    "field": ["error message"]
  }
}
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker (Future)
```bash
docker build -t timetidy-backend .
docker run -p 3001:3001 timetidy-backend
```

## 🔮 Future Enhancements

- **Database Integration**: PostgreSQL with Prisma ORM
- **Real-time Updates**: WebSocket support
- **Email Notifications**: SMTP integration
- **SMS Notifications**: Twilio integration
- **File Uploads**: Profile pictures and documents
- **Advanced Reporting**: Analytics and insights
- **Mobile API**: Optimized for mobile apps
- **Rate Limiting**: API rate limiting
- **Caching**: Redis integration
- **Testing**: Unit and integration tests

## 📝 License

MIT License - see LICENSE file for details 