# Atelier Estates — From Vision to Home

An immersive real estate showroom built with Next.js 16, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, Framer Motion, React Three Fiber and SplitType.

```bash
npm install
npm run dev
```

## The journey

| # | Section | Component | Technique |
|---|---------|-----------|-----------|
| — | Loader | `layout/Loader` | SVG line → plan → building (GSAP); skipped on repeat visits and under reduced motion |
| 1 | Cinematic hero | `sections/Hero` | Pinned 4-layer virtual camera: city → architecture → entrance → interior, each threshold a different clip-path mask |
| 2 | Agency story | `sections/AgencyStory` | Line reveals, scaling image, moving architectural lines, count-ups |
| 3 | Featured residences | `property/PropertyStory` | Held frame that expands to full bleed while the details arrive |
| 4 | Walk through the space | `sections/Walkthrough` | 8 rooms rising into a held frame, plus a room index |
| — | Plan → reality | `property/FloorPlan` | Interactive SVG plan; walls draw in; selecting a room shows the real space |
| 5 | Details | `sections/ArchitecturalDetail` | Curtain / door / blueprint image reveals with drawn annotations |
| — | Architecture | `sections/ArchitectureModel` + `three/BuildingModel` | Lazy R3F massing model; scroll highlights zones. SVG elevation fallback |
| 6 | Location | `sections/LocationExperience` | Map zooms out property → neighbourhood → city; category filters |
| 7 | Discovery | `sections/PropertyDiscovery` | Search phrased as a sentence; asymmetric animated results |
| 8 | Investment | `sections/InvestmentStory` | Scroll-drawn index chart, count-ups, infrastructure timeline |
| 9 | Developments | `sections/Developments` | Pinned horizontal scroll on desktop, swipe rail on touch |
| 10 | Testimonials | `sections/Testimonials` | Editorial quotes, slow image wipes, auto-advance that pauses on hover/focus |
| 11 | Journal | `sections/Journal` | Asymmetric magazine layout |
| 12 | Final CTA | `sections/FinalCTA` | Expanding sunset frame |
| — | Enquiry | `sections/Enquiry` + `app/api/enquiry` | Five-step conversational consultation |

Site-wide: custom cursor (`data-cursor="explore|view|open|discover"`), magnetic CTAs, scroll-velocity drift on architectural annotations (`--sv`), and very subtle daylight that moves from morning to evening as you scroll (`ui/DynamicLighting`).

## Data

Presentation components only consume the types in `src/data/types.ts`. All reads go through `src/lib/repository.ts`. To move to a CMS, Supabase or an API, change the function bodies there and keep their return types. Images live in `src/data/media.ts`; `src/lib/image-loader.ts` maps `next/image` srcsets onto the image CDN (AVIF/WebP via `auto=format`).

Enquiries post to `src/app/api/enquiry/route.ts`; replace `forwardToCrm` with your CRM integration.

## Motion, accessibility and performance

- Every timeline is wrapped in `gsap.matchMedia` (`MQ` in `src/lib/gsap.ts`): full choreography on desktop, lighter on mobile, and none under `prefers-reduced-motion`. Pinned sections fall back to static layouts so no content is hidden.
- SplitType reveals keep the real text in the DOM and restore the original markup once revealed.
- Three.js is only downloaded when the architecture section approaches the viewport on a capable device (≥768px, WebGL2, motion allowed).
- Semantic landmarks, labelled controls, `aria-pressed` and `aria-live` where state changes, visible focus states, focus moved to each new enquiry step, and touch targets of at least 44px.
