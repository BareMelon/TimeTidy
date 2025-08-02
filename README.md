# TimeTidy - Staff Scheduling & Time Tracking

A modern web application for staff scheduling, time tracking, and workforce management. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication & User Management
- Multi-role authentication (Admin, Manager, Employee, Temporary)
- User creation and management
- Password reset functionality
- Session persistence

### 📅 Scheduling & Shift Management
- Create and manage shifts
- Calendar and list views
- Shift swapping requests
- Bulk shift operations
- Location-based scheduling

### ⏰ Time Tracking
- Check-in/out functionality
- Geofencing support
- Real-time status tracking
- Break time management
- Overtime calculations

### 👥 User Management
- Employee profiles
- Role-based permissions
- Temporary and permanent employees
- User status management

### 📊 Dashboard & Reports
- Real-time statistics
- Time reports generation
- Payroll calculations
- Activity tracking

### 🌍 Internationalization
- English and Danish language support
- Dynamic language switching
- Localized content throughout the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Netlify

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TimeTidy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

### Administrator
- **Username**: Administrator
- **Password**: Ju78342107

### Manager
- **Username**: jsmith
- **Password**: manager456

### Employee
- **Username**: jdoe
- **Password**: password123

### Temporary Employee
- **Username**: guest12345
- **Password**: temporary123

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

The project includes a `netlify.toml` configuration file for automatic deployment settings.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── stores/             # Zustand state management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and mock data
├── types/              # TypeScript type definitions
└── utils/              # Helper utilities
```

## Features in Detail

### Language Support
- Switch between English and Danish
- All UI text is translatable
- Persistent language preference

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface

### Real-time Updates
- Live status updates
- Real-time notifications
- Instant feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 