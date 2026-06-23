# UI Styleguide — Questolin

Reference for humans and agents. `@verify-ui` uses this for visual/UX sanity checks.

## Principles

- **Mobile-first** — primary target ~390px width
- **Dark-mode first** — `data-theme="dark"` on `<html>`
- **Dopaminergic feedback** — Quiz richtig/falsch, klare CTAs
- **Zero friction** — Feed sofort nutzbar, max. 2 Taps bis Lernen
- UI copy language: **Deutsch**

## Design tokens (DaisyUI + Tailwind)

| Token / Klasse | Wert / Nutzung |
|----------------|----------------|
| `bg-base-100` | App-Hintergrund |
| `bg-base-200` | Cards, Slide-Shell |
| `text-base-content` | Primärtext |
| `btn-primary` | CTAs: Lernen, Weiter |
| `btn-ghost` | Zurück, sekundär |
| `badge-primary` | Kategorie-Tags |
| `alert-warning` | Leerer Feed |

Erweiterte Vision (Skill-Kategorien, Rarity): siehe externes Questolin UI_UX_STYLE_GUIDE — nach und nach übernehmen.

## Typography

| Role | Font | Notes |
|------|------|-------|
| UI | System stack (Tailwind default) | Kein Custom-Font-Loading in v1 |
| Code in Slides | `font-mono` in `.code` (CSS module) | `components/slides/slideContent.module.css` |

Größen über Tailwind/DaisyUI (`text-2xl`, `card-title`, `text-sm`) — keine Tailwind-Typography-Klassen in PRD-Stil verboten; hier pragmatisch für MVP.

## Components

| Component | Location | Notes |
|-----------|----------|-------|
| SlideRenderer | `components/SlideRenderer.tsx` | Dispatch via Registry |
| Slide shells | `components/slides/*Slide.tsx` | Ein Typ = eine Datei |
| VerticalTopicFeed | `components/VerticalTopicFeed.tsx` | TikTok-Feed, vertikal zwischen Topics |
| HorizontalSlideDeck | `components/HorizontalSlideDeck.tsx` | Horizontal Embla, Dots, Zurück/Weiter |

## Layout

- Max content width: `max-w-lg` (~512px) zentriert
- Breakpoints: mobile primary; `md:` optional für Desktop
- Safe area: später `env(safe-area-inset-*)` für PWA

## States (required)

| State | Pattern |
|-------|---------|
| Loading | Server Component — Next loading.tsx später |
| Empty | `alert` auf Feed wenn keine Topics |
| Error | Topic not found → `notFound()` |
| Quiz feedback | `feedbackOk` / `feedbackBad` in slide CSS module |
| Disabled | `btn` disabled auf Prev/Next an Deck-Enden |

## Accessibility

- Progress dots: `aria-label` pro Slide
- Buttons: sichtbarer Focus (DaisyUI default)
- Kontrast: heller Text auf dunklem Grund (`dark` theme)

## Do / Don't

**Do**

- DaisyUI `card`, `btn`, `badge` wiederverwenden
- Slide-Inhalte aus JSON, nicht in JSX duplizieren
- Touch targets ≥ 44px (`btn`, `py-3` auf Quiz-Optionen)

**Don't**

- Neue Themen nur in React hardcoden
- API-Keys im Frontend für KI-Tutor
- Slide-Typen ohne Registry-Eintrag
