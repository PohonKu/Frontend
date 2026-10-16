# PohonKu frontend restoration

The adopter application uses one API transport. Configure `NEXT_PUBLIC_API_URL` and start with `npm run dev`. Node 22.13+ is required. There is no in-app demo mode or mock fallback. An unavailable backend shows a recoverable loading error; the public programme information remains available.

## Visual contract

The original frontend and the team's Figma file q9coFqJea9ktIrcsErPP6Q are the design sources. Preserve Tilt Warp headings, Inter body, Inria Serif controls, original forest imagery, leaf-shaped team imagery, four theme illustrations, maps and green gradients. The second Figma file Yec4IOYdLmsuAgiVr4dj1e remains inaccessible through the connector; do not invent its unique assets.

The programme is initiated by UGM's Faculty of Forestry, in Tahura Bunder, Gunungkidul, with an initial area of approximately 3 hectares and plans for expansion. Bendo, Gayam and Katimoho are programme examples, not automatically available catalogue stock. English UI and programme text are supplied; Indonesian species stories carry a source-language label.

## Assets

| Existing asset | Placement |
|---|---|
| Logo.svg | Navigation, footer, institutional team panels |
| Original three Unsplash forest photographs | Hero slideshow, 8-second interval, automatic crossfade without visible controls |
| Four gambarCici/Icon Pohonku SVGs | Four programme theme links |
| gambarCici/bg1.svg | Vision panel and care section |
| gambarCici/bg1-wp.webp | Footer and team background |
| bgTahuraHeader.svg | Programme location image |
| Map.svg | Tahura Bunder location section |
| SDG13.svg | Conservation section |
| RectangleFoto.svg | Team identity frames |
| contact-BG.webp and contactBg.svg | Contact page backgrounds |

Original source assets remain in public. Social-network icon variants are retained; live links require confirmed official accounts. Guest-profile asset is available for account identity. No invented member photos, names or social handles.

## Motion and accessibility

GSAP ScrollSmoother uses light desktop smoothing. Native scrolling is retained on touch/reduced-motion devices. Header stays outside the transformed wrapper. Hero crossfades automatically without visible controls; inactive tabs, focus and reduced motion pause automatic transitions. The moving content has an opaque light canvas, independent of OS dark mode; whole-page opacity animation is avoided. checkout input is stable. Card hover and keyboard focus reveal equivalent emphasis. Full-page automated screenshots should use reduced motion because ScrollSmoother renders through a fixed viewport; separately verify active smoothing and capture viewport screenshots.

## Integration contract

Public/adopter routes remain `/id` and `/en`, with legacy redirects. Admin routes remain unchanged. One typed adapter handles `{success,data}` responses. Species and allocated trees are separate; order/payment status is never inferred from tree condition. Missing values remain null. HTML stories render as plain text. Certificates require a real safe document URL.

| Capability | Endpoint |
|---|---|
| Species list/detail | GET /api/v1/trees/species, /:id |
| Login | Google OAuth only; no password or registration UI |
| Session | GET /api/v1/auth/me, POST /api/v1/auth/refresh |
| Google auth | /api/v1/auth/google and existing callback |
| Orders | GET/POST /api/v1/orders; GET /:id |
| Payment | POST /api/v1/orders/:id/payment |
| Cancellation | PATCH /api/v1/orders/:id/cancel |
| Adoptions | GET /api/v1/adoptions, /:id |

Refresh is single-flight with one retry, retaining compatibility with BE `accestToken`. Tokens currently use localStorage to remain compatible with existing admin/OAuth; HttpOnly sessions require BE work. Draft selections survive login, reload and language changes. Periods remain 1/3 years using the existing 1x/1.5x estimate; server order totals are authoritative. Sandbox Snap callbacks only trigger server checks, with bounded polling. Production payment activation is outside this revision.

## Verification and remaining integration

`npm run check` runs all-source lint, typecheck and actual adapter/transport unit tests. `npm run build` verifies production compilation. Browser journey/state scripts run via playwright-cli against port 3000, intercepting HTTP exclusively in the test browser. No test-data switch is shipped in application code. Test evidence is written to the task outputs/restoration directory. CI is configured but has not been run remotely.

FKT still needs to confirm official pricing/benefits, reporting/tag schedule, replacement/cancellation terms, certificate issuer/template/timing, current species photos/stories/translations, members, contacts and legal text. Backend recovery, secure/idempotent payment/stock, PDF and email delivery remain separate work. No flight-offset claims are made.

Polish: hero fills 100dvh with no maximum height; theme descriptions sit below the heading and all cards share padding. Login uses a translucent forest panel and only Google OAuth through the existing backend. Firebase is not used.

## Checkpoint verification (15 October 2026)

A separate clean copy of the tracked checkpoint files was installed using `npm ci`, without local environment files. Lint, TypeScript, all 10 adapter/transport tests and production build passed. Production dependency audit reported zero vulnerabilities; npm reports five high-severity development dependency advisories, retained as follow-up rather than applying a breaking automated upgrade during this design freeze.

Admin imports were reviewed: retained routes use the shared API transport and the existing image uploader; removed adopter components are replaced by the locale-aware feature routes. The baseline includes Next 14 to 16, React 18 to 19 and ESLint 8 to 9 migration changes accumulated during the revision; dependency changes are explicit in package.json and the lockfile.
`browser-journey`, `browser-states`, `browser-polish`, and `browser-scroll` passed 45, 39, 21 and 17 checks respectively (122 checks total) on the checkpoint. Browser screenshot capture required an active fresh session; initial background-session timeouts were rerun successfully.
Team profiles now use the eight supplied portraits in public/images/team, grouped into FKT and IT. The About team section defaults to FKT and renders exactly four active members, with manual accessible tabs (Arrow keys/Home/End), bilingual labels, and responsive columns. Names and English role labels follow the team reference supplied on 16 October 2026.
