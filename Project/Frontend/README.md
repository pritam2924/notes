# EQUIP-FRONTEND

A modern React-based frontend application for industrial equipment tracking and management system. This application provides role-based dashboards for administrators and operators to monitor, maintain, and analyze industrial equipment across facilities.

## 🚀 Features

### Public Interface
- Marketing homepage with hero carousel showcasing key features
- Company statistics, client testimonials, and service offerings
- Responsive design with smooth animations and mobile-first approach

### Authentication System
- User registration and login functionality
- Role-based access control (Admin vs Operator)
- Password recovery system
- JWT-based authentication (simulated with mock data)

### Admin Dashboard
- **Dashboard Overview**: Key metrics and performance charts
- **Equipment Management**: Register new equipment, view equipment lists, track lifecycle history
- **Vendor Management**: Manage equipment suppliers and vendors
- **Maintenance Scheduling**: Plan and track maintenance activities
- **Reports & Analytics**: Generate comprehensive reports and performance analytics
- **Calendar Integration**: Schedule and view maintenance timelines
- **Performance Monitoring**: Monitor equipment utilization and efficiency

### Operator Dashboard
- **Personal Dashboard**: Task overview and system alerts
- **Equipment Status**: Real-time monitoring of equipment health
- **Maintenance Logs**: Record and view maintenance activities
- **Task Management**: Assigned maintenance and inspection tasks
- **Active Alerts**: System-generated notifications and warnings
- **Notifications Center**: Communication and updates hub

## 🛠️ Technology Stack

### Core Technologies
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)

### UI & Styling
- **CSS Framework**: Bootstrap 5
- **React Components**: React Bootstrap
- **Icons**: Bootstrap Icons, React Icons
- **Themes**: Light/Dark mode support

### Data & APIs
- **HTTP Client**: Axios
- **Mock Backend**: JSON Server
- **Data Visualization**: Chart.js, Recharts
- **Maps**: React Leaflet

### Development Tools
- **Code Quality**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EQUIP-FRONTEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the mock backend server**
   ```bash
   npm run db
   ```
   This starts JSON Server on port 5000 with the mock data.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📖 Usage

### Development Workflow
1. **Component Development**: Build reusable components with proper props and state management
2. **Routing Setup**: Configure nested routes for different user roles
3. **API Integration**: Connect to backend endpoints using Axios
4. **Styling**: Apply Bootstrap classes and custom CSS for consistent design
5. **Testing**: Manual testing of user flows and responsive behavior

### Key User Flows

#### Admin User
1. Login with admin credentials
2. Access comprehensive dashboard with system overview
3. Navigate to Equipment Management to register new equipment
4. View equipment lists and lifecycle history
5. Manage vendors and maintenance schedules
6. Generate reports and analyze performance metrics

#### Operator User
1. Login with operator credentials
2. View personal dashboard with assigned tasks
3. Monitor equipment status in real-time
4. Record maintenance activities in logs
5. Respond to active alerts and notifications
6. Update task status and communicate with team

## 🏗️ Project Structure

```
EQUIP-FRONTEND/
├── public/
│   ├── Credentials.json          # Mock user data and authentication
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── adminComponents/      # Admin-specific components
│   │   │   ├── adminNavigation/  # Sidebar and navbar
│   │   │   ├── adminPages/       # Dashboard, Equipment, etc.
│   │   │   ├── equipment/        # Equipment management components
│   │   │   ├── Vendor/           # Vendor management components
│   │   │   └── styles/           # Admin-specific CSS
│   │   ├── operatorComponents/   # Operator-specific components
│   │   ├── include/              # Shared components (Navbar, Footer)
│   │   └── pages/                # Public pages (Home, About, etc.)
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── App.css                   # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 Key Concepts Demonstrated

### Component Architecture
- **Modular Design**: Components organized by feature and user role
- **Reusable Components**: Shared UI elements and modal dialogs
- **State Management**: Local state with React hooks
- **Props Flow**: Data passing through component hierarchy

### Routing & Navigation
- **Nested Routes**: Admin and operator sections with Outlet
- **Protected Routes**: Role-based access control
- **Dynamic Routing**: Parameterized routes for specific entities

### Data Management
- **RESTful API**: CRUD operations with JSON Server
- **Mock Data**: JSON files for development and testing
- **HTTP Requests**: Axios for API communication

### UI/UX Patterns
- **Modal-Based UI**: Bootstrap modals for forms and details
- **Responsive Design**: Mobile-first with Bootstrap grid
- **Interactive Elements**: Animations and hover effects
- **Theme Support**: Light/dark mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact the development team.

---

**Note**: This project uses mock data and JSON Server for development purposes. In production, it would connect to a real backend API for data persistence and user authentication.
