# NutriSense AI - Smart Nutrition Companion

NutriSense AI is a full-stack Next.js application that helps individuals make smarter food choices using AI-powered nutritional intelligence, behavioral tracking, and contextual recommendations.

## Features

- **AI Food Scanner**: Real-time nutritional analysis using Gemini 1.5 Pro.
- **Smart Swap Engine**: Get healthier alternatives for common Indian foods.
- **Dynamic Dashboard**: Track your daily macros, calories, and hydration.
- **AI Chat Coach**: Empathetic expert nutritional advice available 24/7.
- **Weekly Progress**: Deep insights into eating patterns and behavioral health.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase
- **AI**: Google Gemini 1.5 Pro
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand

## Setup

1. Clone the repository.
2. Create a `.env.local` file with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment (Cloud Run)

The project is optimized for Google Cloud Run with a standalone Docker configuration.

1. Build and push the image to Google Artifact Registry.
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy nutrisense-ai --source .
   ```
