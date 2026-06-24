# Feature: PWA minimal (#33)

<!-- GitHub #33 — implement next -->

## Intent
Installable web app: manifest, icons, safe area — no service worker v1.

## Happy Path
- [ ] Web app manifest + icons 192/512
- [ ] Layout meta (theme-color, Apple web app)
- [ ] `viewport-fit=cover` + safe-area CSS on feed/header/FAB
- [ ] README / personal-use: Add to Home Screen instructions
- [ ] `npm run checks` passes

## Edge Cases
- [ ] Works on localhost (dev); iOS install needs HTTPS when deployed

## Implementation Notes
- `app/manifest.ts` + `public/icons/` (192, 512, apple-touch 180)
- `app/layout.tsx`: viewport `viewportFit: cover`, themeColor, appleWebApp, icons
- Safe area: CSS vars in `globals.css`; feed header/swipe hint + tutor FAB
- E2E: `e2e/pwa-manifest.spec.ts`
- Docs: `personal-use.md` install steps, UI_STYLEGUIDE safe area
