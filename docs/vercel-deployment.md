# Vercel Deployment

NITEFY is ready to deploy on Vercel as a standard Next.js app.

## Deploy From GitHub

1. Go to `https://vercel.com`.
2. Sign in with GitHub.
3. Choose `Add New...` and then `Project`.
4. Import `hanva80/nitefy-app`.
5. Keep the default framework preset as `Next.js`.
6. Use these settings:

```txt
Build Command: npm run build
Install Command: npm install
Output Directory: .next
Root Directory: ./
```

7. Deploy.

## Environment Variables

No environment variables are needed for the current MVP.

Later, Spotify or Apple Music integrations will need real API credentials and OAuth callback URLs.

## After Deploy

Check these pages:

- `/`
- `/venue/silq`
- `/venue/the-cave`

Confirm:

- The home screen loads.
- Spotify and Apple Music demo analysis buttons update the profile.
- Venue cards show visual previews.
- Venue detail pages open correctly.
