# Isolated archive and solo-practice review evidence

Scope: draft PR #1 in Owen1night/el-zhady-playtest, branch `codex/solo-practice-and-archive-media`. The interrupted edits and both remote asset commits were recovered; no worktree was reset or user changes discarded.

## What projector mode changes

A local layout preference: root font 19px; content maximum width 1440px instead of 1240px; larger headings/body text and spacing on wide screens; compact desktop navigation hidden. Responsive phone overrides preserve 360px layout. It does not enter browser fullscreen or enable hosting, joining, identity, scoring or live permissions. Header control says «Сыныпқа проекциялау режимі»/«Проектор». Phones put it only in Бөлімдер. Active banner says text is enlarged and has a 44px «Шығу» exit. Preference persists; resetting cosmetic preferences never resets server scores.

## Automated evidence

- Type/content checks; mixed seed generation check; new frozen solo seed/source check; seven image hash/signature check; Vite static build and private live/solo bank bundle guards.
- PostgreSQL 17 disposable loopback service: 57 tests, no failures. RLS/admin/profile/guest/privacy/room lifecycle and existing mixed-game races remain covered. Solo tests cover five maxima, five zero-score attempts, chronology partial credit, best-score preservation, cross-device active-attempt reuse, draft recovery, concurrent begin/submit, retry idempotency, foreign/guest denial and client score-write denial. Reset preserves another user's practice and an earned competition result.
- Chromium: three separate contexts play quiz → map → timeline; 30 early-end controls keep accepted answers, normal host/player reveal, targeted duplicate/stale calls, full next timers, manual between-round starts/final reveal, refresh/reconnect and private results at 360×800 / 1920×1080.
- Chromium solo: all five games opened, answered, reloaded mid-attempt, submitted and reviewed; failed-save retry preserves the latest rapidly changed answer; lost-submit response retry recovers the same committed result. Independent desktop context reads all five scores and 100/100 from SQL; owner reset and guest practice gate/room-code entry checked. No fixture identity issuer or private bank is shipped to `src/dist`.
- Chromium public layouts: seven sections, seven actual loaded portraits, every reading/timeline visual, three >=44px period buttons, selected state, touch/keyboard filtering, no overflow at 360, 390, 768, 1366 and 1920px, projector toggle/persistence/exit and no runtime errors.

Dev browser transport routes HTTP through real local SQL/RLS with fixture identities. It does **not** validate Google, hosted Supabase Auth/Realtime, CAPTCHA, real Cron timing or real cross-device Safari sessions. Local PGlite passed additionally; PostgreSQL 17 supplies the independent-connection race evidence. CI repeats these checks using PostgreSQL 17 and installs Chromium/WebKit. See the current-head PR check result for CI status.

An initial resumed CI run exposed a PostgreSQL count assertion (`'0'` vs `0`), corrected to SQL `count(*)::int`. A preliminary local mixed browser run had a symlinked-font dev-server allow-list issue and was interrupted by edits/React HMR (`AuthProvider missing`); the harness now allows the real dependency directory and final runs use unchanged UI sources. Neither was a hosted failure. The PostgreSQL browser run also caught an autosave acknowledgement race; revision tracking now prevents an older response from claiming a newer answer is saved, and rapid-change/save-error/refresh tests cover it. A local WebKit install failed with network-policy 403; no proxy bypass was attempted. CI WebKit results are recorded separately once available.

## Remaining physical/hosted checks

[Complete later acceptance checklist](PRACTICE_SETUP.md#acceptance-after-a-later-approved-isolated-deployment). Physical iPhone Safari (including markers/portrait/landscape/text zoom, background/resume, touch and VoiceOver) and actual laptop/iPhone Google/cross-device persistence need owner testing after review and a separately approved isolated migration/deployment. No physical device test is claimed. Historian/Kazakh editor review remains pending; introductions stay labelled.

No hosted migration was executed. No Cron configuration, production branch/site/backend, deployed test frontend, or Room A was changed. This draft's new practice backend cannot be exercised on the already-published test URL until its new migration and matching frontend are separately approved.
