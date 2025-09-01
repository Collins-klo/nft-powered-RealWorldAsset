# Authentication Setup Guide

This project now includes a modern authentication system using Supabase. Here's how to set it up:

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your Project URL and anon/public key

## 2. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Supabase Authentication Settings

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add any additional redirect URLs if needed

## 4. Database Setup

### First Time Setup:
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase_setup.sql` into the editor
3. Run the SQL script to create the necessary tables and functions
4. This will create:
   - `user_investments` table to track all share purchases
   - `user_profiles` table for enhanced user data
   - Row Level Security policies for data protection
   - Automatic triggers for user profile creation

### If Tables Already Exist (After Adding Admin Features):
If you get an error saying tables already exist, run only the admin policies:
1. Copy and paste the contents of `admin_policies.sql` into the SQL Editor
2. Run this script to add the admin access policies
3. This adds:
   - Admin policy to view all user investments
   - Admin policy to view all user profiles

## 5. Features

### Authentication Page (`/auth`)
- **Modern UI**: Dark theme with gradient background and mountain image
- **Toggle between Login and Signup**: Single page for both authentication modes
- **Form Validation**: Real-time validation and error handling
- **Responsive Design**: Works on desktop and mobile

### Login Form
- Email and password fields
- Error handling for invalid credentials
- Loading states

### Signup Form
- Username, email, password, and confirm password fields
- Password confirmation validation
- User metadata storage

### Profile Page (`/profile`)
- User information display
- Logout functionality
- Protected route (redirects to auth if not logged in)
- Investment history from database
- Transaction tracking with blockchain links

### Share Purchase Protection
- **Authentication Required**: Users must be logged in to buy shares
- **Database Tracking**: All purchases are recorded in Supabase
- **Transaction History**: Complete investment history with blockchain transaction links
- **Wallet Integration**: Automatic wallet address tracking for users

### Admin Features
- **User Management**: View all registered users and their details
- **Investment Tracking**: See all user investments with transaction details
- **Wallet Monitoring**: Track user wallet addresses and activity
- **User Analytics**: View user registration dates and last sign-in times

### Navigation
- Dynamic auth icon in navbar
- Links to profile when logged in, auth when logged out

## 6. Usage

1. Start your development server: `npm run dev`
2. Navigate to `/auth` to see the authentication page
3. Create an account or log in
4. You'll be redirected to `/profile` after successful authentication
5. Use the logout button in the profile page to sign out
6. **To buy shares**: Users must be logged in and have a connected wallet
7. **View investment history**: Check the profile page for complete transaction history
8. **Admin access**: Navigate to `/admin/users` to view all registered users and their investments

## 7. File Structure

```
├── app/
│   ├── auth/
│   │   └── page.jsx          # Authentication page
│   ├── admin/
│   │   ├── page.jsx          # Admin dashboard (updated)
│   │   └── users/
│   │       └── page.jsx      # User management page
│   └── profile/
│       └── page.jsx          # Profile page (updated)
├── components/
│   └── navbar.jsx            # Navigation (updated)
├── context/
│   └── AuthContext.jsx       # Authentication context
├── utils/
│   ├── supabase.js           # Supabase client
│   └── investmentTracker.js  # Investment tracking utilities
├── supabase_setup.sql        # Database setup script
└── public/assets/images/
    └── login (2).jpg         # Background image
```

## 8. Customization

You can customize the authentication system by:

- Modifying the UI colors and styling in the auth page
- Adding additional user fields during signup
- Implementing email verification
- Adding social authentication providers
- Customizing the profile page layout

## 9. Security Notes

- The Supabase client is configured with environment variables
- Authentication state is managed globally through React Context
- Protected routes automatically redirect unauthenticated users
- Passwords are handled securely by Supabase
