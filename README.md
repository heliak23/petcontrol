<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

1. **Prerequisites:** A [Vercel](https://vercel.com) account.
2. **Environment Variables:** Set the following variables in your Vercel project settings:
   - `VITE_SUPABASE_URL`: Your Supabase URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `VITE_GEMINI_API_KEY`: (Optional) Your Gemini API Key.
3. **Routing:** The project includes a `vercel.json` file to handle SPA routing.
4. **Deploy:** Push your code to a GitHub repository and import it into Vercel, or use the Vercel CLI.
