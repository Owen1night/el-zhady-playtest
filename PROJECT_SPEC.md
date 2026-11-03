# Ел жады: Қазақстан, 1939–1953

## Current scope

Kazakh university museum/learning site for laptop projection and independent phones. This revision extends isolated playtest draft PR #1 from `108dbf5` with the Topic 8 catalogue. Production, hosted databases, Cron and Room A are outside the change. No new migration is required for the content update.

## Architecture

React 19 + TypeScript + Vite, bundled Noto fonts and local archive assets. Hash routes (`#/facts`, `#/heroes`) avoid GitHub Pages refresh 404s. Relative Vite assets preserve repository-subpath hosting. Real configured site URL supplies share/QR links; isolated deployment guards remain unchanged.

Public learning requires neither Auth nor backend availability. Existing Supabase Google/permanent profiles, anonymous guests, protected room controls, Realtime, server-authoritative mixed live games and five separate solo activities remain intact. Private question banks/answer keys/scoring stay behind protected SQL/RPCs. Public readings are study material, not client scoring.

## Typed content

- `src/data/types.ts`: sourced/verified editorial states and entities for theses, facts, figures, events, sources, images, maps, videos and five activity variants.
- `src/data/topic8.ts`: 10 actual numbered theses and 30 distinct numbered facts, stable IDs/claim keys, three fact references per thesis. Only this catalogue contributes the rubric fact count.
- `src/data/learning.ts`: 13 broader readings and 12 own-event timeline descriptions, existing sources and postwar/context figures. Repetitions do not increase the fact count.
- `src/data/war-heroes.ts`: nine additions to Әлия/Мәншүк → 11 wartime profiles. Three postwar/cultural and two context figures stay separate.
- `src/data/topic8-sources.ts`: ten additional individually checked references, including Kazakhstan primary sources for terminology/May 9 observance. Old source metadata and frozen game snapshots are preserved.
- `src/assets/archive/registry.json`: exact original URL, identity, caption, creator or unknown creator, date or unknown date, record-specific rights, treatment and SHA-256 for 18 originals.

Content is **sourced**, not academically verified. Text interpretation, source quality and image rights are separate reviews. Unknown provenance and historian/Kazakh editor review needs remain explicit.

## Pages

| Main section | Content |
| --- | --- |
| Басты бет | Museum identity, direct catalogue/hero shortcuts, study/share entry |
| Хронология | 12 events; three visible touch/keyboard period selectors |
| Майдан | War-period distinction, readings, atlas, separate 1995 Мәншүк stamp |
| Батырлар | 11 wartime → 3 postwar/culture → 2 context profiles; image/name/description/sources/credit |
| Тыл | Evacuation, public aid, children, cinema |
| Соғыстан кейін | Reconstruction, Academy, books, literature, persecution, Semey through 1953 |
| Деректер | 10 arguments + 30 separately numbered facts; references and accessible fact jumps |
| Бейнебөлім | Three exact requested titles awaiting owner URLs/files; no fabricated media |
| Ойындар | Five existing solo activities; permanent-account gate and actual results |
| Нәтиже | Practice /100 separate from live history |
| Дереккөздер | Text source catalogue; image rights additionally below each image |

Desktop main navigation directly exposes Деректер and Батырлар; phone/full menu includes both and Ойынға қосылу. Public routes work without Supabase connectivity.

## Visual/device decisions

Warm ivory, charcoal, restrained red/brass, archival captions and readable Kazakh typography. Images retain aspect ratio and complete artefacts. Мәншүк’s 1937 photo and 1995 stamp are separately captioned records. Modern veteran photos never claim wartime dates. Museum sculpture/coin/stamp portraits are distinguished from photographs of the person.

Each substantive historical card has an identified image or a clearly labelled source-based educational diagram. Natural Earth gives approximate modern educational outlines, not historical borders/front lines/troop routes. No unsourced animated geography added.

Phone layouts collapse to one column. Native controls have selected/focus states and no essential hover/drag. Optional classroom projection changes only local typography/spacing/content width, preserves an exit and grants no hosting permissions. Reduced-motion/no-audio support remains.

## Verification and release

Type/content/media/frozen-bank/build checks, distinct-count/source tests, every narrow-phone portrait, navigation/map/period/video waiting-state/overflow checks, existing practice/SQL regressions. See REVIEW_VERIFICATION.md for actual outcomes and screenshots. Browser emulation is not physical iPhone/Android certification.

Keep the draft unmerged and undeployed for owner review. Topic videos remain 0/3 playable; stronger archive portraits/provenance and historian/Kazakh editorial review are recorded gaps. No hosted SQL/Cron setup is part of this update.
