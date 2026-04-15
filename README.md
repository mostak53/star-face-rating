# Face Rating App - Vercel Deployment Guide

This project is a React Single Page Application (SPA) built with Vite and Tailwind CSS. It is optimized for deployment on Vercel.

## Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**:
   Ensure your code is in a repository.

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com) and click "Add New" > "Project".
   - Import your repository.

3. **Configure Project Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   If you are using the Gemini AI features, add the following environment variable in the Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.

5. **Deploy**:
   Click "Deploy". Vercel will automatically build and host your application.

## Routing Configuration

The project includes a `vercel.json` file which handles client-side routing. This ensures that if a user refreshes the page on a route like `/admin` or `/rating`, Vercel will correctly serve the `index.html` file and let React Router handle the navigation.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Real-Time Data

The application uses a simulated real-time database using `BroadcastChannel` and `localStorage`. This works perfectly in a static hosting environment like Vercel as it runs entirely in the user's browser.
