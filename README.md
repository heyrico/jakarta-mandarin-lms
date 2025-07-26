<<<<<<< HEAD
# Jakarta Mandarin Learning Management System

A comprehensive Learning Management System (LMS) built for Jakarta Mandarin school, featuring role-based access control, dynamic configuration, and real-time features.

## 🚀 Features

### Core Features
- **Role-based Access Control** - Dynamic role and permission management
- **Student Management** - Complete student lifecycle management
- **Class Management** - Course and schedule management
- **Attendance Tracking** - Real-time attendance monitoring
- **Grade Management** - Comprehensive grading system
- **Financial Management** - Invoice and payment tracking
- **Credit System** - Flexible credit-based learning
- **Chat System** - Real-time communication
- **Master Admin Panel** - Complete system administration

### Technical Features
- **Dynamic Configuration** - Settings management without code changes
- **Audit Logging** - Complete activity tracking
- **Real-time Updates** - Live data synchronization
- **Responsive Design** - Mobile-friendly interface
- **Auto-deployment** - CI/CD pipeline for instant updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Ant Design** - UI component library
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **jsPDF** - PDF generation

### Backend
- **NestJS** - Enterprise Node.js framework
- **Prisma ORM** - Type-safe database access
- **MySQL** - Reliable database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **GitHub Actions** - CI/CD pipeline
- **PlanetScale** - Database hosting

## 📁 Project Structure

```
jakarta-mandarin-lms/
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── assets/          # Static assets
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── prisma/          # Database schema
│   │   └── main.ts          # Application entry
│   └── package.json
├── .github/
│   └── workflows/           # CI/CD workflows
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/[username]/jakarta-mandarin-lms.git
   cd jakarta-mandarin-lms
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure DATABASE_URL in .env
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/jakarta_mandarin"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3000"
```

## 📊 Database Schema

### Core Models
- **User** - Users with role-based access
- **Role** - Dynamic roles and permissions
- **Permission** - Granular permissions
- **Kelas** - Class and course management
- **Invoice** - Financial records
- **Settings** - System configuration
- **AuditLog** - Activity tracking

## 🔐 Authentication & Authorization

### Roles
- **ADMIN** - Full system access
- **GURU** - Teacher access
- **SISWA** - Student access
- **FINANCE** - Financial management
- **SSC** - Student service center
- **SEA** - Student enrollment advisor

### Permissions
- **user.create** - Create users
- **user.read** - View user information
- **user.update** - Update user data
- **user.delete** - Delete users
- **finance.*** - Financial operations
- **academic.*** - Academic operations
- **system.*** - System administration

## 🚀 Deployment

### Automatic Deployment
The application uses GitHub Actions for automatic deployment:

1. **Push to main branch** triggers deployment
2. **Frontend deploys to Vercel**
3. **Backend deploys to Railway**
4. **Database migrations run automatically**
5. **Health checks verify deployment**

### Manual Deployment

#### Frontend (Vercel)
```bash
vercel --prod
```

#### Backend (Railway)
```bash
railway up
```

## 🔧 Development Workflow

### Hotfix Process
1. **Bug report** from client
2. **Fix in local environment**
3. **Test thoroughly**
4. **Push to GitHub**
5. **Auto-deploy to production**
6. **Client verification**

### Feature Development
1. **Create feature branch**
2. **Develop and test**
3. **Create pull request**
4. **Code review**
5. **Merge to main**
6. **Auto-deploy**

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics** - Frontend performance
- **Railway Logs** - Backend monitoring
- **Database monitoring** - Query performance
- **Error tracking** - Sentry integration

### Health Checks
- **Frontend health** - Application availability
- **Backend health** - API responsiveness
- **Database health** - Connection status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email:** support@jakartamandarin.com
- **WhatsApp:** +62 812-3456-7890
- **Documentation:** [Wiki](https://github.com/[username]/jakarta-mandarin-lms/wiki)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core LMS functionality
- ✅ Role-based access control
- ✅ Dynamic configuration
- ✅ Master admin panel

### Phase 2 (Next)
- 🔄 Mobile application
- 🔄 Advanced analytics
- 🔄 Integration with external systems
- 🔄 Multi-language support

### Phase 3 (Future)
- 📋 AI-powered features
- 📋 Advanced reporting
- 📋 Third-party integrations
- 📋 Scalability improvements

---

**Built with ❤️ for Jakarta Mandarin School** 
=======
# jakarta-mandarin-lms
Jakarta Mandarin Learning Management System
>>>>>>> 541f87e3f8ee03bb530d828b85e34f29f0fc0dea
