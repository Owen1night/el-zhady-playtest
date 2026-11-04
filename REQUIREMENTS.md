# Requirements — Topic 8 draft, 2026-11-04

Current scope: Owen1night/el-zhady-playtest draft PR #1, branch `codex/solo-practice-and-archive-media`, continuing from owner-reported deployed `108dbf5`. This Topic 8 revision is **not deployed**. No hosted SQL, Cron, production or Room A action.

“Sourced” means references were compared, not academic certification. Tests cannot certify historical truth or physical iPhone behavior. See [content ledger](TOPIC8_CONTENT.md), [rights review](ARCHIVE_MEDIA.md), [verification](REVIEW_VERIFICATION.md).

| Requirement | Section / evidence | Actual status |
| --- | --- | --- |
| Kazakh title / 1939–1953 scope | Shell; front/rear/postwar/timeline | Implemented; 13 sourced readings and 12 timeline events |
| WWII / Great Patriotic War distinction | Thesis 01, facts 01–03, war-periods | Sourced; USHMM + Kazakhstan President’s Archive |
| 10 main theses | Деректер | **10 actual numbered arguments**, three supporting fact IDs each |
| 30 distinct facts | Деректер | **30 separately numbered sourced claims**, unique claim keys; no quiz/timeline duplicates counted |
| ≥10 historical figures | Батырлар | **16 profiles**: 11 wartime, 3 postwar/culture, 2 context |
| >10 war heroes + postwar figures | Батырлар, separate groups | **11 wartime**, nine additions to Әлия/Мәншүк; other groups excluded |
| Reconstruction | Facts 19–21; postwar | Sourced material present |
| Academy of Sciences | Facts 22–23; postwar | Sourced material present |
| Literature/art | Facts 11–12, 27; cinema/literature | Sourced readings present; fuller artistic analysis remains editorial work |
| Persecution of scholars | Facts 25–29; Бекмаханов | Sourced material; disputed precise sentence day omitted |
| Three functioning topic videos | Бейнебөлім | 4 watch pages/title matches checked (3 supplied + sourced 1946 programme); official click-to-load embeds + fallback links implemented. **3 core-topic + 1 Алаш background**. Full playback/embedding/captions/device acceptance still unverified; do not count as three verified core-topic videos |
| AI/street interviews | Separate owner materials | Not counted as the three topic videos |
| Images/captions/credits | 16 image-first profiles; historical cards | Local identified photographs or explicitly labelled stamp/coin/bust portraits; rights below each image |
| Actual Мәншүк stamp | Front/heroes, separate artefact | Preserved 1995 original; not presented as a wartime photo |
| Portrait quality | ARCHIVE_MEDIA.md | All 16 phone cards visually reviewed; better photo/provenance gaps remain explicit |
| Historical maps | Front atlas / live map | Approximate sourced locations, Natural Earth base; no historical borders/troop routes asserted |
| Animated historical map | Atlas | Not complete; interactive selection exists, no invented troop animation |
| Five different solo games | Ойындар | Existing quiz/matching/ordering/map/classification retained; permanent accounts, server scoring |
| Result after every activity | Solo review | Existing actual scores, explanations and sources retained |
| Combined result | Profile/results | Five best /20 slots → /100; separate competition history |
| Progress persistence/reset | Solo protected RPCs/RLS | Existing server persistence retained; no hosted setup inferred or changed |
| Live starts/waiting/final reveal | Competition | Existing host-controlled behavior retained; no scoring/schema/Cron changes |
| Working navigation/links/buttons | Desktop + phone menu + home shortcuts | Деректер/Батырлар directly discoverable, hash routes, keyboard fact jumps |
| Responsive / no 360px overflow | Eight public sections | Browser checks at 360/390/768/1366/1920px; physical Safari acceptance still needed |
| Touch targets / no hover or drag dependency | Native controls and menus | Existing >=44px period/navigation controls, touch and keyboard paths retained |
| Readability / keyboard focus | Fonts, source lists, fact jumps | Browser-checked; full assistive-technology audit pending |
| Video controls/inline playback | Future supplied media | YouTube controls/playsinline=1, no autoplay, fullscreen, finite error/retry and fallback paths checked with explicit browser fixtures; actual device playback pending |
| Projection mode | Local CSS preference | Existing enlarged text/spacing, phone-menu toggle, persistence and exit; no host permission effect |
| Share / QR | Configured real site URL | Existing isolated-host guards retained; no localhost public links |
| Motion/reduced motion/no automatic audio | Existing CSS/game feedback | Preserved; no new flashing/audio |
| Typed content and references | src/data and private banks | Implemented; no invented reviewer/verification metadata |
| Public content without account | Public routes | Available even when Supabase unavailable |
| Permanent practice / anonymous live / RLS/admin/privacy | Existing secure backend | Retained; regression tested in disposable local SQL; no new migration for Topic 8 |
| Deployment-safe assets/navigation | Vite + hashes | Static subpath build retained; images bundled locally |
| Public published site | Existing deployment | Owner reports 108dbf5 deployed. **New Topic 8 revision remains draft** |
| Four required documentation files | Root Markdown | Updated |

Profiles are short sourced introductions, not full biographies. Wartime grouping does not imply identical formal awards. Иван Панфилов is included as commander of a Kazakhstan-formed multinational unit, not described as ethnically Kazakh. Academic/Kazakh editorial review remains pending.
