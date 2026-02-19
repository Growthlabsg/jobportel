/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors
        primary: {
          DEFAULT: '#0F7377', // GrowthLab Teal
          dark: '#0A5A5D',
          light: '#1A8F94',
          50: '#E6F7F8',
          100: '#CCEFF1',
          200: '#99DFE3',
          300: '#66CFD5',
          400: '#33BFC7',
          500: '#0F7377',
          600: '#0C5C5F',
          700: '#094547',
          800: '#062E30',
          900: '#031718',
        },
        secondary: {
          DEFAULT: '#F5A623', // GrowthLab Orange
          dark: '#D18A1F',
          light: '#F7B84D',
          50: '#FEF5E7',
          100: '#FDEBD0',
          200: '#FBD7A1',
          300: '#F9C372',
          400: '#F7AF43',
          500: '#F5A623',
          600: '#C4851C',
          700: '#936415',
          800: '#62420E',
          900: '#312107',
        },
        accent: {
          DEFAULT: '#14B8A6', // Teal Accent
          dark: '#0F8B7D',
          light: '#1FD4C0',
        },
        // Text Colors
        text: {
          primary: '#1E293B', // Slate Dark
          secondary: '#64748B', // Muted Foreground
        },
        // Background Colors
        background: {
          DEFAULT: '#FFFFFF', // White
          card: '#F1F5F9', // Slate Light
        },
        border: {
          DEFAULT: '#E2E8F0', // Border Color
        },
        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        destructive: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        // Special Category Colors
        purple: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        pink: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#DB2777',
        },
        rose: {
          DEFAULT: '#F43F5E',
          light: '#FB7185',
          dark: '#E11D48',
        },
        // Slate (for compatibility)
        slate: {
          DEFAULT: '#334155',
          dark: '#1E293B',
          light: '#F1F5F9',
          muted: '#64748B',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #0F7377, #14B8A6)',
        'gradient-hero': 'linear-gradient(135deg, #0F7377 0%, #1E293B 100%)',
        'gradient-success': 'linear-gradient(to right, #10B981, #34D399)',
        'gradient-warning': 'linear-gradient(to right, #F59E0B, #FBBF24)',
        'gradient-info': 'linear-gradient(to right, #3B82F6, #60A5FA)',
      },
      borderRadius: {
        base: '0.5rem', // 8px
        sm: 'calc(0.5rem - 4px)', // 4px
        md: 'calc(0.5rem - 2px)', // 6px
        lg: '0.5rem', // 8px
        xl: 'calc(0.5rem + 4px)', // 12px
      },
      boxShadow: {
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'button-hover': '0 10px 20px rgba(15, 115, 119, 0.2)',
      },
    },
  },
  plugins: [],
}
