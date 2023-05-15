# Jitera Auctions

This is an app that allows users to post items for auction and other users to bid on them.

## 🚀 Quick Start

Run project locally - needs a deployed Next.js app (see [Deployment](#deployment)):

```bash
# First, install dependencies
npm install

# Then, setup prisma
npm run prisma -- generate
npm run prisma -- db push # Needs to be run after every change to the `schema.prisma` file

# Then, run the app
npm run dev

# Finally, open the app in your browser: http://localhost:3000
```

## ✨ Features

- [x] User authentication
- [x] Item listing and publishing
- [x] Credit deposit
- [x] Live Auction with support to multiple bidders
- [ ] Item auction closing
- [ ] Outbid notifications
- [ ] Bid history

## Tech Stack

- [React.js](https://react.dev/) - Frontend library
- [Next.js](https://nextjs.org/) - React framework
- [Next Auth](https://next-auth.js.org/) - Authentication
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [TailwindCSS](https://tailwindcss.com/) - Utility CSS classes
- [TailwindUI](https://tailwindui.com/) - UI components
- [Node.js](https://nodejs.org/en/) - REST API
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://www.prisma.io/) - ORM
- [Ably](https://ably.com/) - Realtime API
- [Inngest](https://inngest.io/) - CRON jobs
- [Vercel](https://vercel.com/) - Deployment

## Testing

```bash
npm test
```

## Deployment

Since this is a fullstack Next.js app, it can be deployed using the [Vercel CLI](https://vercel.com/docs/cli):

```bash
# Authenticate with Vercel
vercel login

# Add project to Vercel
vercel project add my-project-name

# Link project to Vercel
vercel link my-project-name

# Setup environment variables
vercel env add NEXTAUTH_URL production # https://[app-name].vercel.app
vercel env add NEXTAUTH_SECRET production # [random string]
vercel env add ABLY_API_KEY production # [Ably API Key] - https://faqs.ably.com/setting-up-and-managing-api-keys

# Deploy
vercel --prod
```

[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) should be configured after deployment.
