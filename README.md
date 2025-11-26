# One At A Time

A dog adoption landing and profiles site, built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS v4.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Key routes and files:

- `app/page.tsx` — landing page with a hero and a responsive grid of dogs.
- `app/dogs/[id]/page.tsx` — dog details page with gallery, facts, and CTAs.
- `app/components/DogCard.tsx` — card component used in the grid.
- `lib/dogs.ts` — dummy data source and types. Replace with real content later.
- `next.config.ts` — configured to allow remote images from common placeholder domains.

Styling is via Tailwind v4 utilities defined in `app/globals.css`. Fonts use `next/font` (Geist).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Adding or updating dogs

Dog data lives in `lib/dogs.ts` under the exported `dogs` array. Each entry must match this shape:

```ts
type Dog = {
  id: string;        // URL-safe unique id, used in /dogs/[id]
  name: string;
  breed: string;
  age: string;       // e.g., "2 years", "8 months"
  sex: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  location: string;  // Sanctuary or city
  description: string;
  image: string;     // Primary image URL
  gallery?: string[];// Optional additional images
}
```

Image domains must be allowed by Next Image. Update `next.config.ts` if you use new hosts.

## Production build

```bash
npm run build
npm start
```

## Learn more

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
