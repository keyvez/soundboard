# Cloudflare Pages Deployment Setup

This document explains how to configure automatic deployments from GitHub to Cloudflare Pages.

## Option 1: Cloudflare Dashboard (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to **Workers & Pages**

2. **Create a New Pages Project**
   - Click **Create application** → **Pages** → **Connect to Git**
   - Select your GitHub repository: `keyvez/soundboard`
   - Choose the branch to deploy (e.g., `main` or `001-specify-scripts-bash`)

3. **Configure Build Settings**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: app/build
   Root directory: (leave empty or set to /)
   ```

4. **Environment Variables** (if needed)
   - No environment variables required for this project

5. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy your site
   - Future pushes to the selected branch will trigger automatic deployments

## Build Configuration

The build process:
1. Cloudflare runs `pnpm install` at the root
2. Runs `npm run build` which:
   - Changes to the `app` directory
   - Installs app-specific dependencies
   - Runs `vite build` to create the production build
3. Deploys the `app/build` directory

## Current Deployment

- **Project Name**: soundboard
- **Account ID**: 87007ff674b608bde526cd0ca53b2b82
- **Current URL**: https://soundboard-35o.pages.dev

## Deployment History

View deployments at: https://dash.cloudflare.com/[account-id]/pages/view/soundboard

## Troubleshooting

### Build fails with "vite: not found"
- Ensure the build command is: `npm run build` (not `npm run build:app`)
- Ensure the build output directory is: `app/build`

### Dependencies not installing correctly
- Check that `pnpm-workspace.yaml` includes the `app` directory
- The root package.json build script handles dependency installation

### Wrong directory being deployed
- Verify **Build output directory** is set to: `app/build`
- Check that `app/build` directory contains `index.html`
