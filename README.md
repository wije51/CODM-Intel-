# ⚡ CODM Intel - Tactical Social Platform

Welcome to **CODM Intel**, the ultimate social hub for Call of Duty Mobile players. Built for performance, security, and elite tactical advantage.

## 🚀 Features

- **💬 World Chat**: Real-time global communication with active auto-moderation.
- **🤖 AI Gaming Assistant**: Gemini-powered tactical intel. Ask about loadouts, maps, and strategies.
- **🔫 Loadout Armory**: Share and discover elite weapon builds with the community.
- **👤 Elite Profiles**: Secure Google authentication and gaming UID tracking.
- **🛡️ Security First**: Integrated XSS protection and rate limiting to prevent spam.
- **📱 Fully Responsive**: Optimized for both high-end desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend & Auth**: Supabase (Postgres & Realtime)
- **AI**: Google Gemini AI
- **Animations**: Framer Motion
- **State Management**: Zustand

## 📦 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wije51/CODM-Intel-.git
   cd CODM-Intel-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root and add:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_ERROR_EMAIL=your_email@example.com
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 🛡️ Database Setup

Create a `profiles`, `messages`, and `loadouts` table in Supabase. Detailed SQL schema can be found in the documentation artifacts.

## 📝 License

Built with ❤️ for the CODM Community.
