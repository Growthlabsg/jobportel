# Growth Lab Job Portal

A comprehensive job portal integrated into the Growth Lab platform - a global startup community platform. We welcome applications from anywhere in the world.

## 📋 Overview

This job portal is a **section within the Growth Lab platform**, not a standalone application. It provides job seekers and employers with a complete job marketplace experience, including job search, applications, resume building, co-founder matching, and analytics.

## 🎨 Brand Theme

- **Primary Color**: Teal `#0F7377` (GrowthLab Teal)
- **Gradient**: `from-[#0F7377] to-[#1E293B]`
- **Background**: Light gray (`bg-gray-50`)
- **Text**: Slate gray (`#334155`)
- **Design**: Minimalist, clean, card-based layouts

## 🏗️ Architecture

- **Type**: Frontend application (Next.js)
- **Integration**: API-based integration with main Growth Lab platform
- **Authentication**: Token-based (handled by main platform)
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS

## 📚 Documentation

### Planning Documents
1. **[Implementation Plan](./IMPLEMENTATION_PLAN.md)** - Complete 18-week development plan with all phases
2. **[API Integration Guide](./API_INTEGRATION_GUIDE.md)** - How to integrate with Growth Lab API
3. **[Feature Priority](./FEATURE_PRIORITY.md)** - Feature prioritization and MVP scope
4. **[Technical Architecture](./TECHNICAL_ARCHITECTURE.md)** - System architecture and design patterns
5. **[Quick Start Guide](./QUICK_START.md)** - Get started with development

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000/jobs`

See [Quick Start Guide](./QUICK_START.md) for detailed setup instructions.

## 📁 Project Structure

```
growthlab-job-portal/
├── app/                    # Next.js pages and routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── jobs/             # Job-specific components
│   ├── employer/         # Employer components
│   └── shared/           # Shared components
├── services/              # API services and utilities
├── hooks/                 # Custom React hooks
├── store/                 # State management
├── types/                 # TypeScript types
└── lib/                   # Library code
```

## 🎯 Key Features

### For Job Seekers
- ✅ Advanced job search with filters
- ✅ Job matching algorithm
- ✅ Application tracking
- ✅ Resume builder with PDF export
- ✅ Job alerts
- ✅ Saved jobs
- ✅ Co-founder matching

### For Employers
- ✅ Job posting (multi-step form)
- ✅ Job management
- ✅ Application management
- ✅ Interview scheduling
- ✅ Analytics dashboard
- ✅ Candidate pipeline
- ✅ Communication tools

## 🔌 Integration Points

### Main Growth Lab Platform
- **Authentication**: Token-based auth from main platform
- **User Context**: User data from main platform API
- **Navigation**: Embedded within main platform UI
- **Styling**: Consistent with Growth Lab brand

### API Endpoints
All endpoints prefixed with `/api/jobs/`:
- `/api/jobs` - Job listings
- `/api/jobs/applications` - Applications
- `/api/jobs/employer/*` - Employer endpoints
- `/api/jobs/interviews` - Interview management
- `/api/jobs/cofounders` - Co-founder matching
- `/api/jobs/alerts` - Job alerts
- `/api/jobs/analytics` - Analytics data

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State**: Zustand + React Query
- **Icons**: Lucide React
- **API Client**: Axios

## 📅 Development Phases

### Phase 1-2: Foundation (Weeks 1-2)
- Project setup
- Design system
- Base components
- API integration

### Phase 2-4: Core Features (Weeks 3-8)
- Job discovery
- Job posting
- Application management

### Phase 5-9: Enhanced Features (Weeks 9-13)
- Interview management
- Resume builder
- Co-founder matching
- Analytics

### Phase 10-12: Polish & Integration (Weeks 14-18)
- Advanced features
- UI/UX polish
- API integration
- Deployment

## 🎨 Design Principles

1. **Minimalist**: Clean, uncluttered interface
2. **Card-based**: Information organized in cards
3. **Responsive**: Mobile-first design
4. **Accessible**: WCAG 2.1 AA compliance
5. **Fast**: Optimized performance
6. **Intuitive**: Clear navigation and interactions

## 🔒 Security

- Token-based authentication
- Input validation (client + server)
- XSS prevention
- CSRF protection
- Secure file uploads
- Rate limiting

## 📊 Performance Goals

- Page load time: < 3 seconds
- Time to interactive: < 5 seconds
- Lighthouse score: > 90
- Mobile-friendly: 100%

## 🧪 Testing

- Unit tests for utilities
- Component tests
- Integration tests
- E2E tests for critical flows

## 📦 Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.growthlab.sg
NEXT_PUBLIC_AUTH_ENDPOINT=https://api.growthlab.sg/auth
```

### Build
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Follow the implementation plan phases
2. Maintain code quality standards
3. Write tests for new features
4. Update documentation
5. Follow the design system

## 📝 Notes

- **Non-standalone**: No separate authentication or user management
- **API-first**: All data operations through API
- **Modular**: Each feature is self-contained
- **Incremental**: Features can be developed independently

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review the implementation plan
3. Consult the API integration guide

## 📄 License

Part of the Growth Lab platform.

---

**Built for Growth Lab - Global Startup Community** 🚀

