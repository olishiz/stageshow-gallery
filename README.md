# Stageshow Gallery

A browsable, installable gallery of showcase UI by **Oliver Sim** ([@olishiz](https://github.com/olishiz)): bento grids, animated faux product screens, cards, hero sections and micro-interactions. Every component has its own page with a large live preview, a light/dark toggle and copy-able source. It is a Progressive Web App, so the whole gallery works offline once loaded.

The components follow Benji Taylor's [Stageshow skill](https://github.com/benjitaylor/skills) (installed in `.agents/skills/stageshow`): believable UI simplified to what the viewer needs, deliberate crops, one hero per grid, motion with a cause, and a poster frame that tells the story on its own.

## Stack

- Next.js 16 (App Router, static generation) + TypeScript
- Tailwind CSS v4, shadcn/ui on Base UI for site primitives
- `lucide-react` icons, `shiki` for build-time syntax highlighting
- A hand-written service worker, generated after each build with the precache list

## Run it

```bash
npm install
npm run dev        # http://localhost:4317 (no service worker in dev)
npm run build      # next build, then writes public/sw.js
npm start          # production server on http://localhost:4317
npm run lint
npm run typecheck
npm run icons      # regenerate the PNG icons in public/icons
```

Test offline behavior against `npm run build && npm start`; the service worker only registers in production.

## What's inside

| Category | Components |
| --- | --- |
| Bento grids | Launch bento, Ruled edge bento, Profile bento |
| Animated stills | AI answer, Instant payout, Board drag, Command menu |
| Cards | Pricing card, Profile card, Holo pass |
| Hero sections | Split hero, Status hero |
| Micro-interactions | Copy command, Like burst, Hold to confirm, Sliding tabs |

Each showcase lives in `src/components/showcase/<slug>.tsx` as one self-contained client component that depends only on React, Tailwind and `lucide-react`. The detail page shows that exact file as its code view. Metadata (title, category, design size, craft notes) lives in `src/lib/registry.ts`.

Motion rules shared by every animated piece:

- Loops open and close on their poster frame and only play while on screen.
- With `prefers-reduced-motion`, components hold the poster frame and interactive ones drop decorative motion.
- Bento grids play their one motion once, as they scroll into view.

## PWA

- `src/app/manifest.ts`: name, `standalone` display, theme and background colors, 192/512 icons, maskable icons, category shortcuts.
- `public/icons`: icons rendered from one SVG by `scripts/generate-icons.mjs`, including `apple-touch-icon.png`.
- `scripts/build-sw.mjs` runs after `next build`. It reads `.next/prerender-manifest.json` and `.next/static` and writes `public/sw.js` from `scripts/sw-template.js`, precaching every page and asset under a cache versioned by the build id.
- Navigations go network-first, then the precache, then `/offline`. RSC payloads are cached as they're fetched. When offline, unknown payloads fail so the router falls back to a full page load served from the precache.
- `src/components/site/pwa-provider.tsx` registers the worker and captures `beforeinstallprompt`. The header Install button and the dismissible install card use it, and iOS Safari gets Add to Home Screen instructions instead.

## Deploy

Ready for Vercel with no configuration: the build command is `npm run build`, which also generates `public/sw.js`. Set `NEXT_PUBLIC_SITE_URL` if you use a custom domain, so metadata gets absolute URLs.

## Credits

Showcase craft guidance from [benjitaylor/skills](https://github.com/benjitaylor/skills) (MIT). The macOS pointer in *Board drag* is from the Stageshow kit.
