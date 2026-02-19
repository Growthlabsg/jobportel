# Growth Lab Job Portal - Implementation Plan

## Overview
This job portal is a **section within the Growth Lab platform**, not a standalone application. It will be integrated via API with the main Growth Lab portal (global startup community). We welcome applications from anywhere in the world.

## Architecture Principles

### 1. API-First Design
- All data operations go through API endpoints
- No direct database connections from frontend
- Authentication handled by main Growth Lab platform
- User context passed via API tokens/headers

### 2. Modular Structure
- Each feature is a self-contained module
- Reusable components across features
- Shared utilities and services
- Clear separation of concerns

### 3. Integration Points
- **Authentication**: Token-based (JWT/OAuth) from main platform
- **User Management**: User data from main platform API
- **Navigation**: Embedded within main platform UI
- **Styling**: Consistent with Growth Lab brand (#0F7377 teal)

## Technology Stack Recommendations

### Frontend
- **Framework**: Next.js 14+ (App Router) or React with Vite
- **Styling**: Tailwind CSS (matches Growth Lab theme)
- **UI Components**: shadcn/ui or custom components
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand or React Query
- **API Client**: Axios or Fetch with interceptors

### Backend (API Layer)
- **Framework**: Node.js/Express or Python/FastAPI
- **Database**: PostgreSQL (recommended) or MongoDB
- **ORM**: Prisma or TypeORM
- **File Storage**: AWS S3 or similar for resumes/PDFs
- **Email**: SendGrid or AWS SES
- **PDF Generation**: Puppeteer or jsPDF

## Implementation Phases

---

## Phase 1: Foundation & Setup (Week 1-2)

### 1.1 Project Initialization
- [ ] Initialize Next.js/React project
- [ ] Configure Tailwind CSS with Growth Lab theme
- [ ] Set up project structure (components, pages, utils, services)
- [ ] Configure TypeScript
- [ ] Set up ESLint and Prettier
- [ ] Initialize Git repository

### 1.2 Design System Setup
- [ ] Create theme configuration (colors, typography, spacing)
- [ ] Build base UI components:
  - Button (primary, secondary, outline variants)
  - Card
  - Input/Textarea
  - Select/Dropdown
  - Badge
  - Modal/Dialog
  - Tabs
  - Loading states (skeleton loaders)
  - Toast notifications
- [ ] Create layout components:
  - Header/Navbar
  - Sidebar (if needed)
  - Footer
  - Container/Wrapper

### 1.3 API Integration Setup
- [ ] Create API client service
- [ ] Set up authentication interceptors
- [ ] Create API endpoint constants
- [ ] Implement error handling
- [ ] Set up request/response interceptors
- [ ] Create mock API responses for development

### 1.4 Routing Structure
- [ ] Set up main routes:
  - `/jobs` - Main jobs page
  - `/jobs/find-startup-jobs` - Job search
  - `/jobs/hire-talents` - Employer portal
  - `/jobs/applications` - Application management
  - `/jobs/resume-builder` - Resume builder
  - `/jobs/find-cofounder` - Co-founder matching
  - `/jobs/alerts` - Job alerts
  - `/jobs/analytics` - Analytics
  - `/jobs/manage` - Job management
  - `/jobs/interviews` - Interview management

---

## Phase 2: Core Features - Job Discovery (Week 3-4)

### 2.1 Main Jobs Page (`/jobs`)
- [ ] Hero section with gradient text
- [ ] Enhanced search bar component
- [ ] Quick stats dashboard component
- [ ] Featured job cards with hover effects
- [ ] Tab navigation (Overview, Hire Talent, Find Jobs, Find Co-founder)
- [ ] Employer and job seeker CTA sections
- [ ] Responsive design implementation

### 2.2 Find Startup Jobs (`/jobs/find-startup-jobs`)
- [ ] Advanced search bar with autocomplete
- [ ] Multi-filter sidebar:
  - Location filter (Global locations, Remote, Hybrid, Regions)
  - Job type filter
  - Experience level filter
  - Salary range filter
  - Remote work options
  - Industry filter
  - Company size filter
  - Funding stage filter
  - Skills filter
  - Benefits filter
  - Visa sponsorship filter
  - Featured jobs toggle
- [ ] View mode toggle (Grid/List)
- [ ] Sorting options (Recent, Salary, Company, Match Score)
- [ ] Job cards component:
  - Company logo/icon
  - Job title and company name
  - Location and job type badges
  - Skills tags (color-coded)
  - Salary range
  - Match score indicator
  - Urgency indicator
  - Quick actions (View, Apply, Save, Share)
- [ ] Job details modal/page
- [ ] Pagination or infinite scroll
- [ ] Empty states
- [ ] Loading states

### 2.3 Job Details & Application
- [ ] Job details page/modal
- [ ] Application form component:
  - Cover letter (rich text editor)
  - Resume upload
  - Portfolio URL
  - LinkedIn profile
  - GitHub profile
  - Expected salary
  - Availability date
  - Notice period
  - Additional information
- [ ] Form validation
- [ ] File upload handling
- [ ] Save/Share functionality

---

## Phase 3: Employer Features (Week 5-6)

### 3.1 Hire Talents (`/jobs/hire-talents`)
- [ ] Employer dashboard layout
- [ ] Navigation menu (Post Jobs, Manage Jobs, Applications, Analytics, Settings)
- [ ] Quick stats cards
- [ ] Recent activity feed

### 3.2 Job Posting Form
- [ ] Multi-step form component:
  - **Step 1: Basic Information**
    - Job title, company, department
    - Reporting structure, team size
  - **Step 2: Job Details**
    - Type, experience level, location
    - Remote work options, work schedule
  - **Step 3: Compensation**
    - Salary range, currency (30+ currencies)
    - Equity options, stock options
    - Bonus structure
  - **Step 4: Job Description**
    - Rich text editor
    - Requirements, skills, education
    - Certifications, languages
  - **Step 5: Benefits & Perks**
    - Health/dental/vision insurance
    - Retirement plans, PTO
    - Learning budget, conference budget
    - Gym membership, meal allowance
    - Transportation, parking
  - **Step 6: Work Environment**
    - Company values, work environment
    - Team culture, growth opportunities
  - **Step 7: Requirements**
    - Work authorization
    - Background check, drug test
    - Security clearance
    - Travel requirements
  - **Step 8: Application Process**
    - Application method (Platform/External)
    - Application URL/Email
    - Interview process details
    - Timeline expectations
  - **Step 9: Visibility**
    - Featured job toggle
    - Urgency level
    - Application deadline
    - Start date
- [ ] Form validation for each step
- [ ] Auto-save draft functionality
- [ ] Preview mode
- [ ] Publish/Draft/Save actions

### 3.3 Job Management (`/jobs/manage`)
- [ ] Job list view with table/cards
- [ ] Status badges (Draft, Published, Paused, Closed, Archived)
- [ ] Quick actions (Edit, View, Delete, Duplicate)
- [ ] Bulk selection and actions
- [ ] Search and filter functionality
- [ ] Sort options
- [ ] Status management dropdown
- [ ] Bulk operations (Pause, Close, Delete)

---

## Phase 4: Application Management (Week 7-8)

### 4.1 Applications Page (`/jobs/applications`)
- [ ] Applications table/list view
- [ ] Column display:
  - Applicant name, email, phone
  - Job title, application date
  - Status badge
  - Resume preview
  - Match score
- [ ] Tab navigation:
  - Applications (all)
  - Job Postings
  - Shortlisted
  - Interviews
  - Analytics
- [ ] Search and filter:
  - By status
  - By job
  - By date range
- [ ] Status update functionality
- [ ] Quick actions:
  - Shortlist
  - Schedule interview
  - Send message
  - Download resume
  - View profile

### 4.2 Application Tracking (`/jobs/applications/tracking`)
- [ ] Visual pipeline component:
  - Applied
  - Under Review
  - Shortlisted
  - Interview Scheduled
  - Interviewed
  - Offer Extended
  - Hired
  - Rejected
- [ ] Drag-and-drop status updates
- [ ] Notes and feedback section
- [ ] Timeline view
- [ ] Activity log
- [ ] Rating system

### 4.3 Application Communication (`/jobs/applications/communication`)
- [ ] In-app messaging interface
- [ ] Email integration
- [ ] Communication history
- [ ] Email templates:
  - Rejection emails
  - Interview invitations
  - Offer letters
- [ ] Bulk messaging functionality
- [ ] Template editor

---

## Phase 5: Interview Management (Week 9)

### 5.1 Interview Scheduling (`/jobs/interviews`)
- [ ] Interview scheduling form:
  - Interview type (Phone, Video, In-person, Technical)
  - Date and time picker
  - Interviewer assignment
  - Location/meeting link
  - Interview notes
- [ ] Interview calendar view
- [ ] Interview list view
- [ ] Upcoming interviews section
- [ ] Past interviews section
- [ ] Reschedule functionality
- [ ] Cancel functionality
- [ ] Interview notes form
- [ ] Candidate rating form
- [ ] Feedback form
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Time zone support
- [ ] Meeting link generation (Zoom, Google Meet)
- [ ] Interview reminders

---

## Phase 6: Resume Builder (Week 10)

### 6.1 Resume Builder (`/jobs/resume-builder`)
- [ ] Multi-step form:
  - **Step 1: Personal Information**
    - Name, email, phone, location
    - Website, LinkedIn, summary
  - **Step 2: Work Experience**
    - Multiple positions
    - Title, company, location, dates
    - Description, achievements
  - **Step 3: Education**
    - Degree, institution, location
    - Dates, description
  - **Step 4: Skills**
    - Technical and soft skills
  - **Step 5: Projects**
    - Project details, technologies, links
  - **Step 6: Certifications**
    - Name, issuer, date, description
  - **Step 7: Additional Sections**
    - Languages, awards, publications
- [ ] Template selection (Modern, Classic, Creative)
- [ ] Customization options:
  - Accent color picker (default: #0F7377)
  - Font size options
- [ ] Real-time preview
- [ ] Auto-save functionality
- [ ] PDF export functionality
- [ ] Download as PDF
- [ ] Save drafts

---

## Phase 7: Co-founder Matching (Week 11)

### 7.1 Find Co-founder (`/jobs/find-cofounder`)
- [ ] Co-founder profile form:
  - Personal information
  - Skills and expertise
  - Experience level
  - Availability (Full-time, Part-time, Evenings/Weekends)
  - Commitment level
  - Looking for description
  - Values and principles
  - Industry interests
  - Languages
  - Portfolio links
- [ ] Compatibility scoring algorithm
- [ ] Profile matching display
- [ ] Search and filter:
  - Compatibility score (0-100%)
  - Location
  - Experience level
  - Availability
  - Skills
  - Values
  - Industry
  - Commitment level
  - Timezone
  - Languages
- [ ] View modes (Card, List)
- [ ] Profile actions:
  - Save profile
  - Send connection request
  - Send message
  - View full profile
  - Share profile
- [ ] Compatibility score display

---

## Phase 8: Job Alerts & Saved Jobs (Week 12)

### 8.1 Job Alerts (`/jobs/alerts`)
- [ ] Create alert form:
  - Alert name
  - Keywords (multiple)
  - Locations (multiple)
  - Job types (multiple)
  - Frequency (Daily, Weekly, Monthly)
- [ ] Alert list view
- [ ] Edit alert functionality
- [ ] Enable/disable toggle
- [ ] Delete alert
- [ ] Alert notification system:
  - Email notifications
  - In-app notifications
  - Custom frequency

### 8.2 Saved Jobs
- [ ] Save job functionality
- [ ] Saved jobs list page
- [ ] Quick access component
- [ ] Remove from saved
- [ ] Apply from saved jobs

---

## Phase 9: Analytics (Week 13)

### 9.1 Employer Analytics (`/jobs/analytics`)
- [ ] Overview metrics dashboard:
  - Total views
  - Total applications
  - Conversion rate
  - Average time to hire
- [ ] Job performance section:
  - Views per job
  - Applications per job
  - Conversion rate per job
  - Top performing jobs
- [ ] Time range selector:
  - Last 7 days
  - Last 30 days
  - Last 90 days
  - Last year
- [ ] Trends visualization:
  - View trends (up/down indicators)
  - Application trends
  - Conversion rate trends
- [ ] Recent activity feed
- [ ] Export functionality:
  - Export analytics data
  - PDF reports
  - CSV export
- [ ] Charts and graphs (using Chart.js or Recharts)

### 9.2 Job Seeker Analytics
- [ ] Application tracking:
  - Total applications
  - Interview rate
  - Offer rate
  - Response rate
- [ ] Job market insights:
  - Top skills in demand
  - Salary trends
  - Industry trends
  - Location trends

---

## Phase 10: Advanced Features (Week 14-15)

### 10.1 Job Matching Algorithm
- [ ] Match score calculation (0-100%)
- [ ] Factors:
  - Skills match
  - Experience level
  - Location preferences
  - Salary expectations
  - Work preferences
- [ ] Display match score on job cards
- [ ] Personalized job recommendations

### 10.2 Resume Parsing
- [ ] Resume upload and parsing
- [ ] Skills extraction
- [ ] Experience extraction
- [ ] Education extraction
- [ ] Auto-fill application forms

### 10.3 Company Profiles
- [ ] Company information display
- [ ] Company size
- [ ] Funding stage
- [ ] Industry
- [ ] Company description
- [ ] Company values
- [ ] Team culture
- [ ] Visa sponsorship information

### 10.4 Job Sharing
- [ ] Share job listings
- [ ] Copy job link
- [ ] Share via social media
- [ ] Email job to friend

### 10.5 Visa Sponsorship
- [ ] Visa sponsorship indicator
- [ ] Visa details display
- [ ] Work authorization requirements
- [ ] Filter by visa sponsorship

---

## Phase 11: Polish & Optimization (Week 16)

### 11.1 UI/UX Enhancements
- [ ] Smooth animations and transitions
- [ ] Loading states (skeleton loaders)
- [ ] Empty states with helpful messages
- [ ] Error handling with retry options
- [ ] Toast notifications
- [ ] Success/error feedback
- [ ] Form validation messages
- [ ] Accessibility improvements:
  - Keyboard navigation
  - Screen reader support
  - High contrast ratios
  - Focus indicators
  - ARIA labels

### 11.2 Performance Optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] API response caching
- [ ] Debounced search
- [ ] Virtual scrolling for long lists

### 11.3 Responsive Design
- [ ] Mobile-first approach
- [ ] Responsive grid layouts
- [ ] Mobile-optimized forms
- [ ] Touch-friendly buttons
- [ ] Collapsible filters on mobile
- [ ] Mobile navigation

### 11.4 Testing
- [ ] Unit tests for utilities
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] Cross-browser testing

---

## Phase 12: API Integration & Deployment (Week 17-18)

### 12.1 API Integration
- [ ] Connect to main Growth Lab API
- [ ] Authentication integration
- [ ] User context handling
- [ ] Error handling for API failures
- [ ] API rate limiting handling
- [ ] Retry logic for failed requests

### 12.2 Deployment Preparation
- [ ] Environment configuration
- [ ] Build optimization
- [ ] Production build testing
- [ ] API endpoint configuration
- [ ] CORS configuration
- [ ] Security headers

### 12.3 Documentation
- [ ] API integration guide
- [ ] Component documentation
- [ ] Deployment guide
- [ ] User guide (if needed)

---

## File Structure

```
growthlab-job-portal/
├── src/
│   ├── app/                    # Next.js app directory (if using App Router)
│   │   ├── jobs/
│   │   │   ├── page.tsx       # Main jobs page
│   │   │   ├── find-startup-jobs/
│   │   │   ├── hire-talents/
│   │   │   ├── applications/
│   │   │   ├── resume-builder/
│   │   │   ├── find-cofounder/
│   │   │   ├── alerts/
│   │   │   ├── analytics/
│   │   │   ├── manage/
│   │   │   └── interviews/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ...
│   │   ├── jobs/              # Job-specific components
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   ├── JobSearch.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   └── ...
│   │   ├── employer/          # Employer-specific components
│   │   │   ├── JobPostingForm.tsx
│   │   │   ├── ApplicationsTable.tsx
│   │   │   └── ...
│   │   └── shared/            # Shared components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ...
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts      # API client
│   │   │   ├── jobs.ts        # Job endpoints
│   │   │   ├── applications.ts
│   │   │   ├── employers.ts
│   │   │   └── ...
│   │   └── utils/
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── ...
│   ├── hooks/
│   │   ├── useJobs.ts
│   │   ├── useApplications.ts
│   │   └── ...
│   ├── store/                 # State management
│   │   ├── jobsStore.ts
│   │   └── ...
│   ├── types/
│   │   ├── job.ts
│   │   ├── application.ts
│   │   └── ...
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   └── lib/
│       ├── constants.ts
│       └── ...
├── public/
│   ├── images/
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## Key Integration Points with Main Growth Lab Platform

### 1. Authentication
- Receive authentication token from main platform
- Pass token in API requests
- Handle token expiration/refresh

### 2. User Context
- Get user profile from main platform API
- Determine user role (employer/job seeker)
- Use user preferences from main platform

### 3. Navigation
- Embed within main platform layout
- Use main platform navigation structure
- Maintain breadcrumbs to main platform

### 4. Styling
- Match Growth Lab brand colors (#0F7377)
- Use consistent typography
- Follow main platform design patterns

### 5. API Endpoints
- All endpoints should be prefixed (e.g., `/api/jobs/...`)
- Follow RESTful conventions
- Return consistent response format

---

## Success Metrics

### Technical
- ✅ All features implemented
- ✅ Responsive on all devices
- ✅ Fast load times (< 3s)
- ✅ Zero critical bugs
- ✅ Accessible (WCAG 2.1 AA)

### Integration
- ✅ Seamless integration with main platform
- ✅ Consistent user experience
- ✅ Proper error handling
- ✅ API reliability

---

## Next Steps

1. **Review and approve this plan**
2. **Set up development environment**
3. **Begin Phase 1: Foundation & Setup**
4. **Set up API endpoints structure**
5. **Create design mockups (if needed)**
6. **Start iterative development**

---

## Notes

- This is a **non-standalone** application - no separate authentication, user management, or landing pages
- All user management handled by main Growth Lab platform
- Focus on job portal functionality only
- API-first approach ensures easy integration
- Modular structure allows for incremental development
- Each phase can be developed and tested independently

