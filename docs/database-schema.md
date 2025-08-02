# TimeTidy Database Schema

## Overview

The TimeTidy database is designed to handle all aspects of staff scheduling, time tracking, and payroll management for small businesses. The schema is optimized for performance and includes proper relationships between entities.

## Core Entities

### Users
- **Purpose**: Store employee and admin information
- **Key Fields**: id, username, email, role, hourlyRate, isTemporary
- **Relationships**: One-to-many with Shifts, CheckIns, ShiftSwaps

### Locations
- **Purpose**: Store business location information with optional geofencing
- **Key Fields**: id, name, address, latitude, longitude, geofenceRadius
- **Relationships**: One-to-many with Shifts, CheckIns

### Shifts
- **Purpose**: Store scheduled work shifts
- **Key Fields**: id, userId, locationId, date, startTime, endTime, role, status
- **Relationships**: Belongs to User and Location, has many CheckIns and ShiftSwaps

### CheckIns
- **Purpose**: Track actual work time with check-in/out records
- **Key Fields**: id, userId, shiftId, checkInTime, checkOutTime, overtimeMinutes
- **Relationships**: Belongs to User, Shift, and Location

### ShiftSwaps
- **Purpose**: Handle shift exchange requests between employees
- **Key Fields**: id, requesterId, originalShiftId, targetUserId, status
- **Relationships**: References Users and Shifts

### PayrollAddOns
- **Purpose**: Store configurable pay supplements (tillæg)
- **Key Fields**: id, name, type, value, conditions
- **Features**: Flexible condition system for automatic application

## Key Features

### Role-Based Access Control
- **Admin**: Full system access
- **Manager**: Limited admin functions
- **Employee**: Own data access only

### Geofencing
- Optional location-based check-in restrictions
- Configurable radius per location
- GPS coordinate validation

### Flexible Payroll System
- Base hourly rates per employee
- Configurable add-ons (percentage or fixed amount)
- Conditional application based on time, role, or location
- Automatic overtime calculation

### Audit Trail
- Complete action logging
- User activity tracking
- Change history for all entities

## API Design

### RESTful Endpoints
```
GET    /api/users              # List users
POST   /api/users              # Create user
GET    /api/users/:id          # Get user details
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user

GET    /api/shifts             # List shifts
POST   /api/shifts             # Create shift
GET    /api/shifts/:id         # Get shift details
PUT    /api/shifts/:id         # Update shift
DELETE /api/shifts/:id         # Delete shift

POST   /api/checkins           # Check in
PUT    /api/checkins/:id       # Check out
GET    /api/checkins           # List check-ins

POST   /api/shift-swaps        # Request shift swap
PUT    /api/shift-swaps/:id/approve # Approve/reject swap
```

### Authentication
- JWT-based authentication
- Role-based route protection
- Token refresh mechanism

### Data Validation
- Zod schemas for type safety
- Server-side validation
- Consistent error responses

## Mock Data Structure

The application includes comprehensive mock data demonstrating:
- Multiple user roles (admin, manager, employee)
- Scheduled shifts across different locations
- Check-in/out records with overtime tracking
- Pending shift swap requests
- Payroll add-ons with conditions
- Notification system examples

## Scalability Considerations

### Database Optimization
- Indexed foreign keys
- Efficient query patterns
- Proper relationship constraints

### Performance
- Pagination for large datasets
- Caching strategies
- Background job processing for heavy operations

### Multi-tenancy Ready
- Schema supports multiple business locations
- User isolation by organization
- Configurable business rules per tenant

## Security Features

### Data Protection
- Password hashing (bcrypt)
- Input sanitization
- SQL injection prevention

### Privacy Compliance
- GDPR compliance features
- Data export capabilities
- User consent management
- Audit logs for compliance

This schema provides a solid foundation for a comprehensive staff management system while remaining flexible enough to accommodate various business needs. 