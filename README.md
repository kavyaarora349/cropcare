# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Backend Deployment (Required for Crop Analysis & Leaf Bot)

The crop analysis and Leaf Bot features require the backend API to be deployed. Follow these steps:

### 1. Deploy Backend to Render

1. Push your code to GitHub (if not already done)
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml` configuration
6. Set the **GEMINI_API_KEY** environment variable:
   - Go to Environment tab
   - Add: `GEMINI_API_KEY` = `AIzaSyB3a8ZVqmIftYefKyiM-vXWBUquJN1EuQE`
7. Click "Create Web Service"
8. Wait for deployment to complete (~5-10 minutes)
9. Copy your backend URL (e.g., `https://cropcare-backend.onrender.com`)

### 2. Configure Frontend

Update the frontend to use your deployed backend:

1. In your frontend deployment platform (Lovable/Vercel/etc.), set environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
2. Rebuild and redeploy the frontend

### 3. Test

- Open your deployed frontend
- Try the **Scan Your Crop** feature (upload an image)
- Try the **Leaf Bot** (click the chat icon)
- Both should now work!

**Note**: Render free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds.

