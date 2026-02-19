# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- Code editor (VS Code recommended)
- Access to Growth Lab API (for production)

## Initial Setup

### 1. Clone/Initialize Project

```bash
# If starting fresh
cd growthlab-job-portal

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Or if using existing repo
git clone <repository-url>
cd growthlab-job-portal
npm install
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install axios react-hook-form zod @hookform/resolvers
npm install zustand @tanstack/react-query
npm install lucide-react
npm install date-fns
npm install react-pdf jspdf html2canvas  # For PDF generation

# UI libraries (optional - can use custom)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-toast

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
npm install -D msw  # For API mocking
```

### 3. Configure Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_VERSION=v1

# Authentication (from main Growth Lab platform)
NEXT_PUBLIC_AUTH_ENDPOINT=http://localhost:3000/auth

# File Storage
NEXT_PUBLIC_STORAGE_BUCKET=http://localhost:3001/storage

# Feature Flags
NEXT_PUBLIC_ENABLE_RESUME_PARSING=false
NEXT_PUBLIC_ENABLE_COFOUNDER_MATCHING=true

# Development
NEXT_PUBLIC_USE_MOCK_API=true
```

### 4. Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F7377',
          dark: '#0A5A5D',
          light: '#1A8F94',
        },
        slate: {
          DEFAULT: '#334155',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #0F7377, #1E293B)',
      },
    },
  },
  plugins: [],
}
```

### 5. Project Structure Setup

Create the following directories:

```bash
mkdir -p app/jobs/{find-startup-jobs,hire-talents,applications,resume-builder,find-cofounder,alerts,analytics,manage,interviews}
mkdir -p components/{ui,jobs,employer,shared}
mkdir -p services/{api,utils}
mkdir -p hooks
mkdir -p store
mkdir -p types
mkdir -p lib
mkdir -p public/{images,icons}
```

### 6. Create Base Files

#### `lib/constants.ts`
```typescript
export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
] as const;

export const EXPERIENCE_LEVELS = [
  'Entry',
  'Junior',
  'Mid',
  'Senior',
  'Expert',
  'Team Lead',
  'Manager',
] as const;

export const APPLICATION_STATUSES = [
  'Submitted',
  'Reviewed',
  'Shortlisted',
  'Interviewing',
  'Offered',
  'Hired',
  'Rejected',
] as const;
```

#### `services/api/client.ts`
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  // Get token from main platform (implement based on your auth system)
  const token = localStorage.getItem('growthlab_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 7. Create First Component

#### `components/ui/Button.tsx`
```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-primary text-white hover:bg-primary-dark': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
          'border-2 border-primary text-primary hover:bg-primary hover:text-white': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### `lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 8. Create Main Jobs Page

#### `app/jobs/page.tsx`
```typescript
export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-slate-800 bg-clip-text text-transparent">
          Growth Lab Jobs
        </h1>
        {/* Add your content here */}
      </div>
    </div>
  );
}
```

### 9. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/jobs`

## Development Workflow

### 1. Start with Base Components
- Build UI components first
- Test in isolation
- Document props and usage

### 2. Build Features Incrementally
- Start with MVP features
- Test each feature before moving on
- Get feedback early

### 3. API Integration
- Use mock API for development
- Switch to real API when ready
- Handle errors gracefully

### 4. Testing
- Test on multiple browsers
- Test responsive design
- Test error scenarios

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Testing (when set up)
npm run test         # Run tests
npm run test:watch   # Watch mode
```

## Next Steps

1. ✅ Complete Phase 1: Foundation & Setup
2. ✅ Build base UI components
3. ✅ Set up API client
4. ✅ Create main jobs page
5. ✅ Implement job search
6. ✅ Build job posting form
7. ✅ Add application management
8. ✅ Integrate with main platform

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Tailwind Not Working
- Check `tailwind.config.js` content paths
- Restart dev server
- Clear browser cache

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)

