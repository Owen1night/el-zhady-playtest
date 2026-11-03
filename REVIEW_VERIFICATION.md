# Topic 8 review — 2026-11-04

Continuing from owner-reported deployed playtest `108dbf5`, on the same draft PR #1 branch. The new content is not merged or deployed. There is no SQL or Pages-workflow diff from that baseline. No hosted database, Cron, production or Room A operation was performed.

## Content and images

- 10 substantive numbered theses, 30 separately numbered sourced claims; each fact appears once in the counting ledger and three distinct IDs support each thesis. Automated uniqueness/source checks plus manual semantic review; no quiz/timeline inflation. All 30 counted claims concern 1939–1953; current holiday-calendar context is separate. A final source pass replaced the current-calendar fact with the actual 8 May 1945 decree (archive catalogue + ҚазАқпарат’s contemporary newspaper reproduction).
- 11 wartime profiles, 3 postwar/cultural profiles, 2 context introductions; main desktop/mobile access and home shortcuts. All 16 image-first cards inspected at 360px, including the existing portraits. Photographs, modern photos, stamps, coin relief and museum bust are identified separately.
- 18 local original files pass SHA-256/signature checks. Мәншүк/Әлия now use identified photos; the original 1995 Мәншүк stamp is separately captioned and byte-identical. [Exact rights/remaining portrait gaps](ARCHIVE_MEDIA.md).
- All text-source and media-record links were examined with the web tool; Natural Earth terms independently opened. Local images/alt text and source-reference links are checked separately in the browser. HTTP availability does not establish historical truth or future availability.
- Exact three video titles implemented as waiting entries, **0/3 playable**, no invented URL or empty player; AI/street interviews remain separate.

## Checks actually performed for this update

- `npm run check`, `npm test` (11 test files passed; disposable local PGlite), media hashes, frozen mixed/solo content checks, isolated recipe self-test, static build and all private-bank bundle guards passed.
- Public Chromium checks: 360/390/768/1366/1920px, eight sections, 10/30 catalogue elements, 16 profiles with 11/3/2 grouping, all image loading/alt text, source references, keyboard fact jumps, main menu access, map selection, three >=44px selected-state period markers with touch/keyboard paths, projector persistence/exit, no horizontal overflow/runtime errors. Final wording/screenshots rechecked at 360/1920px.
- Existing Chromium practice integration passed: all five actual SQL-scored games, per-game mid-attempt reload/draft restore, failed-save/lost-submit retry, sources/reveals, independent desktop-context 100/100, guest gate/room-code entry and owner reset. These fixtures use local SQL and fixture Auth, not hosted Supabase or Google.
- All 16 portrait credit blocks were measured to remain inside their cards; an additional local capture pass removed fixed-header/skip-link overlays from element screenshots, without changing the shipped UI. [Review gallery](review/topic8/README.md).
- Initial local runs caught a test selector expecting a menu label without its visible section number, and a genuine tablet video-grid overflow from long Kazakh titles. Selector corrected; intrinsic grid tracks fixed; affected checks rerun successfully. A temporary pre-asset CI run failed the offline hash check before the image commit arrived; all 18 originals were recovered and the temporary asset workflow removed. CI then reached WebKit and exposed its 32767px screenshot-canvas limit on the expanded fact page. Oversized evidence now uses top/middle/end viewport captures; all content/control/image assertions remain in place, and 16 portrait cards still have individual captures.

## Limits and release boundary

Local WebKit is not installed; [current-head PR checks](https://github.com/Owen1night/el-zhady-playtest/pull/1/checks) provide the independent WebKit/PostgreSQL 17 result; consult that status rather than inferring success from earlier runs. Chromium/WebKit emulation is not a physical iPhone. Safari touch/text zoom/orientation/VoiceOver/background-resume and actual Google/cross-device hosted persistence still need owner acceptance after an approved isolated release. No physical iPhone/Android result is claimed.

Historian/Kazakh editor review remains pending. ARCHIVE_MEDIA.md flags weak Бекмаханов coin resolution, Хиуаз's missing original author/date, stamp substitutes for several archive photos and Төлеген's museum bust. Do not call these full academic biographies or every portrait a verified wartime photograph.

The older evidence below describes the prior archive/practice baseline; it is retained as history, not proof of the new Topic 8 CI result.

<details><summary>Earlier archive/practice verification at the 108dbf5 baseline</summary>

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

Dev browser transport routes HTTP through real local SQL/RLS with fixture identities. It does **not** validate Google, hosted Supabase Auth/Realtime, CAPTCHA, real Cron timing or real cross-device Safari sessions. Local PGlite passed additionally; PostgreSQL 17 supplies the independent-connection race evidence. GitHub Actions also passed PostgreSQL 17, Chromium and WebKit checks, including all five practice games and public layouts at 360, 390, 768, 1366 and 1920px. See the current-head PR check result for the latest rerun. All five activity control types were additionally completed using keyboard input in the practice runner.

An initial resumed CI run exposed a PostgreSQL count assertion (`'0'` vs `0`), corrected to SQL `count(*)::int`. A preliminary local mixed browser run had a symlinked-font dev-server allow-list issue and was interrupted by edits/React HMR (`AuthProvider missing`); the harness now allows the real dependency directory and final runs use unchanged UI sources. Neither was a hosted failure. The PostgreSQL browser run also caught an autosave acknowledgement race; revision tracking now prevents an older response from claiming a newer answer is saved, and rapid-change/save-error/refresh tests cover it. A local WebKit install failed with network-policy 403; no proxy bypass was attempted. WebKit was subsequently installed and exercised successfully in GitHub Actions; this is browser-engine emulation, not physical iPhone evidence.

## Remaining physical/hosted checks

[Complete later acceptance checklist](PRACTICE_SETUP.md#acceptance-after-a-later-approved-isolated-deployment). Physical iPhone Safari (including markers/portrait/landscape/text zoom, background/resume, touch and VoiceOver) and actual laptop/iPhone Google/cross-device persistence need owner testing after review and a separately approved isolated migration/deployment. No physical device test is claimed. Historian/Kazakh editor review remains pending; introductions stay labelled.

No hosted migration was executed. No Cron configuration, production branch/site/backend, deployed test frontend, or Room A was changed. This draft's new practice backend cannot be exercised on the already-published test URL until its new migration and matching frontend are separately approved.

</details>
