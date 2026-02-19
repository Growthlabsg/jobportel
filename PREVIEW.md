# Growth Lab Job Portal - Preview Guide

## 🚀 Access the Platform

The development server should be running at:
**http://localhost:3000/jobs**

If it's not running, start it with:
```bash
cd /Users/arulv97/growthlab-job-portal
npm run dev
```

## 📱 What You'll See

### Main Jobs Page (`/jobs`)

#### 1. Hero Section
- **Gradient Background**: Teal (#0F7377) to dark slate gradient
- **Large Heading**: "Find Your Next Startup Opportunity"
- **Subheading**: "Connect with innovative startups worldwide"
- **Search Bar**: 
  - Search icon on the left
  - Placeholder: "Search jobs, companies, skills..."
  - "Search Jobs" button on the right
- **Responsive**: Stacks on mobile, side-by-side on desktop

#### 2. Quick Stats Dashboard
Four stat cards showing:
- **2,847** Active Jobs
- **156** Companies
- **12.4k** Candidates
- **89%** Hire Rate

Each card has:
- Large bold number in primary teal color
- Small gray text label below
- White background with subtle shadow
- Hover effect (slight shadow increase)

#### 3. Tab Navigation
Four tabs at the top:
- **Overview** (default)
- **Hire Talent**
- **Find Jobs**
- **Co-founder**

Styled with:
- Gray background
- White active tab with shadow
- Primary teal text for active tab
- Smooth transitions

#### 4. Overview Tab Content

**Left Side - Featured Jobs:**
- Section title: "Featured Jobs"
- Three job cards (currently placeholder):
  - **Card 1**: Senior Full Stack Developer
    - Company: Tech Startup Inc. • Remote
    - Badges: Full-time, Remote
    - Description preview
  - **Card 2**: Similar structure
  - **Card 3**: Similar structure
- "View All Jobs" button at bottom

**Right Side - Quick Actions:**
- Section title: "Get Started"
- Three action cards:
  - **For Job Seekers**
    - Briefcase icon
    - "Browse thousands of startup jobs worldwide"
  - **For Employers**
    - Users icon
    - "Post jobs and find the best talent for your startup"
  - **Find Co-founder**
    - TrendingUp icon
    - "Connect with potential co-founders for your startup"

Each action card:
- Has icon in teal background circle
- Hover effect (shadow increase)
- Clickable (cursor pointer)

#### 5. Other Tabs
- **Hire Talent**: Card with description and "Post a Job" button
- **Find Jobs**: Card with description and "Browse Jobs" button
- **Co-founder**: Card with description and "Explore Profiles" button

## 🎨 Design Features

### Color Scheme
- **Primary**: Teal #0F7377 (Growth Lab brand)
- **Background**: Light gray (bg-gray-50)
- **Cards**: White with subtle borders
- **Text**: Slate gray (#334155)
- **Gradients**: Teal to dark slate

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes
- **Body**: Medium weight, readable sizes

### Components
- **Buttons**: 
  - Primary: Teal background, white text
  - Outline: Teal border, teal text
  - Hover effects on all
- **Cards**: 
  - White background
  - Subtle shadow
  - Rounded corners
  - Hover effects
- **Badges**: 
  - Rounded pills
  - Color-coded (primary, gray)
  - Small text

### Responsive Design
- **Mobile**: Single column, stacked elements
- **Tablet**: 2 columns for stats
- **Desktop**: Full layout with side-by-side sections

## 🔗 Available Routes

All routes are accessible (with placeholder content):

1. **Main Page**: `/jobs` ✅ (Fully designed)
2. **Find Jobs**: `/jobs/find-startup-jobs` (Placeholder)
3. **Hire Talent**: `/jobs/hire-talents` (Placeholder)
4. **Applications**: `/jobs/applications` (Placeholder)
5. **Resume Builder**: `/jobs/resume-builder` (Placeholder)
6. **Co-founder**: `/jobs/find-cofounder` (Placeholder)
7. **Alerts**: `/jobs/alerts` (Placeholder)
8. **Analytics**: `/jobs/analytics` (Placeholder)
9. **Manage**: `/jobs/manage` (Placeholder)
10. **Interviews**: `/jobs/interviews` (Placeholder)

## 🖼️ Visual Preview

### Hero Section
```
┌─────────────────────────────────────────────────┐
│  [Gradient Background: Teal to Dark Slate]      │
│                                                  │
│  Find Your Next Startup Opportunity             │
│  Connect with innovative startups worldwide...  │
│                                                  │
│  [🔍 Search jobs, companies, skills...] [Search]│
└─────────────────────────────────────────────────┘
```

### Stats Dashboard
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  2,847  │ │   156   │ │  12.4k  │ │   89%   │
│ Active  │ │Companies│ │Candidates│ │Hire Rate│
│  Jobs   │ │         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Featured Jobs Card
```
┌────────────────────────────────────────────┐
│ Senior Full Stack Developer                │
│ Tech Startup Inc. • Remote                  │
│ [Full-time] [Remote]                       │
│                                            │
│ We're looking for an experienced...        │
└────────────────────────────────────────────┘
```

## 🎯 What's Working

✅ **Fully Functional:**
- Navigation between routes
- Tab switching
- Responsive layout
- Hover effects
- Button interactions
- Component styling

✅ **Ready for Development:**
- All routes created
- Base components ready
- API client configured
- TypeScript types defined
- Utility functions ready

## 📝 Next Steps to See More

1. **Navigate to different routes** using the links
2. **Test responsive design** by resizing browser
3. **Check hover effects** on cards and buttons
4. **Try tab navigation** on main jobs page

## 🐛 If Server Isn't Running

1. Check if port 3000 is in use:
   ```bash
   lsof -ti:3000
   ```

2. Kill existing process if needed:
   ```bash
   kill -9 $(lsof -ti:3000)
   ```

3. Start fresh:
   ```bash
   cd /Users/arulv97/growthlab-job-portal
   npm run dev
   ```

4. Wait for "Ready" message, then visit:
   ```
   http://localhost:3000/jobs
   ```

---

**Enjoy exploring the Growth Lab Job Portal! 🚀**

