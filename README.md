# CivicHero

CivicHero is a web platform designed to empower Kenyan citizens through civic education, community engagement, and gamified rewards. The platform aims to make civic knowledge accessible, encourage active participation in local governance, and foster a stronger democracy in Kenya.

---

## Project Overview

CivicHero helps users learn about their rights, connect with their communities, and make a real impact through an engaging and accessible experience. The platform supports SMS-based sign-up, making it usable on any phone without requiring app downloads. It offers a personalized onboarding journey, civic lessons, community discussions, and a token-based reward system to motivate and recognize civic engagement.

---

## Key Features

- **SMS-Powered Sign-Up:** Users can register and verify their accounts using SMS, ensuring accessibility even on basic phones.
- **Civic Education:** Access a growing library of civic lessons tailored to Kenyan governance, public services, environment, youth programs, and more.
- **Community Connection:** Engage with local communities and participate in discussions and activities relevant to your county.
- **Gamification & Rewards:** Earn tokens, unlock achievements, and climb leaderboards by completing tasks and participating actively.
- **Personalized Onboarding:** A multi-step onboarding process collects user profile data and civic interests to tailor the experience.
- **Bilingual Support:** Available in English and Kiswahili to serve a wider audience.
- **24/7 SMS Support:** Continuous support through SMS to assist users anytime.

---

## How It Works

1. **Sign Up with SMS:** Enter your phone number and verify via SMS. No app download required.
2. **Complete Onboarding:** Set up your profile by providing basic information, selecting your county, and choosing civic interests.
3. **Learn & Engage:** Access educational content, participate in community discussions, and stay informed about local governance.
4. **Make Impact:** Earn tokens and achievements by completing tasks, attending events, and engaging with your community.
5. **Track Progress:** View your achievements, tokens, and impact on your personalized dashboard.

---

## Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS with Radix UI components
- **Backend:** API routes in Next.js, Supabase for database and authentication
- **SMS Integration:** Twilio for SMS-based authentication and notifications
- **State Management & Forms:** React Hook Form, Zod for validation
- **Other Libraries:** Lucide React icons, Recharts for charts, Sonner for notifications

---

## Folder Structure (Brief)

- `app/` - Main application pages and layouts
- `components/` - Reusable UI components and feature-specific components
- `app/api/` - API routes for authentication, user management, and other backend logic
- `lib/` - Utility libraries and integrations (e.g., Supabase, Twilio)
- `hooks/` - Custom React hooks for authentication, toast notifications, etc.
- `public/` - Static assets like images and icons
- `styles/` - Global CSS and Tailwind configuration

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or pnpm package manager
- A Supabase project for backend services
- Twilio account for SMS services

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TristanBrian/civic-heroo
cd civic-heroo
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Configure environment variables:

Create a `.env.local` file in the root directory and add your Supabase and Twilio credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## Usage

- New users start at the landing page where they can sign up via SMS.
- After verification, users complete onboarding to personalize their experience.
- Users access the dashboard to learn, engage, and track their civic activities.
- Admins can manage content and users via the admin interface (if applicable).

---

## Recent Changes

### User Type and Authentication Fixes

- Updated the `User` interface usage in the authentication hook (`hooks/use-auth.tsx`) to import the canonical `User` type from `types/index.ts`.
- Removed the local `User` interface in `use-auth.tsx` to ensure consistency across the app.
- Added mapping logic to convert the legacy `onboardingCompleted` property to the current `onboarded` property in user state management.
- These changes resolve TypeScript errors related to missing properties (`completedLessons`, `completedTasks`, `onboarded`, `streak`) on the `User` type.
- Ensured that user data loaded from localStorage and updated via the `useAuth` hook correctly reflects the expected user properties used in the dashboard and other components.

---

## Contribution

Contributions are welcome! Please open issues or submit pull requests for bug fixes, features, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please lessusbrian7@gmail.com  |  Tristan.Dev

---

