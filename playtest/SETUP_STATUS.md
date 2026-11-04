# Current Topic 8 review note — 2026-11-04

The owner now identifies playtest revision `108dbf5` as deployed. This update continues on draft PR #1; its new Topic 8 changes are not deployed. No hosted SQL/Auth/Cron verification or changes were performed in this task. Do not infer additional migration application from a deployed frontend. The recorded seven manual migrations below remain historical owner reports; never rerun them. Production and Room A are unchanged.

The remaining earlier status is historical and superseded where the owner has subsequently completed a step. See ../PRACTICE_SETUP.md for the separate solo-practice setup contract and ../TOPIC8_CONTENT.md for the content-only revision, which needs no new migration.

---

# Isolated playtest — backend setup reported complete, frontend pending

Test repository: `Owen1night/el-zhady-playtest`.
Test Supabase project: **`isufimcphbxhkmrquocc`** (`el-zhady-playtest`).
Pinned application/migration source: PR #6 **`465574fcc86f44b9d166c998c28a2e0d00a73b25`**.
The later PR #5 editorial revision is not silently incorporated into this pinned PR #6 snapshot. Both source PRs remain draft/unmerged. Production main remains `e60d7d483ad6e4f518c81329527e3382170b02e2`.

## Completed infrastructure and owner reports

- Assistant copied the prepared isolated bootstrap to this separate repository; Pages workflow is manual-only and refuses the production repository. Owner reports GitHub Actions selected as Pages source. No deployment runs existed at the latest API inspection.
- Owner created the separate empty test project and reports all seven pinned migrations ran manually once, with success. None was executed against hosted Supabase by the assistant. Do not rerun them or use blanket `db push`.

| Version | Test-project status |
|---|---|
| 20261101000100_stage2_foundation | Applied manually once, owner report |
| 20261101000200_live_quiz | Applied manually once, owner report |
| 20261101000300_live_quiz_content_v1 | Applied manually once, owner report |
| 20261103000100_competition_lifecycle | Applied manually once, owner report |
| 20261103000200_question_bank_v2 | Applied manually once, owner report |
| 20261103000300_mixed_live_engine | Applied manually once, owner report and success screenshot |
| 20261103000400_mixed_bank_v3 | Applied manually once, owner report |

- Owner enabled test Cron and ran pinned scheduler setup once. Screenshots show both jobs active, quiz every1second with the exact tick command, cleanup daily `17 3 * * *`, cleanup command equality true, and five recent succeeded quiz runs about one second apart. Owner reports scheduler readiness true. This does not establish an actual daily cleanup execution or gameplay acceptance.
- Owner reports mixed bank count/distinct count map10/10, quiz30/30, timeline10/10; early-timeout RPC exists, reservation RLS true, unauthenticated anon execute false.
- Screenshots show all four expected admin SELECT result policies, and Realtime contains only public live_competitions/live_quiz_sessions/room_participants/rooms.
- Owner reports anonymous sign-ins enabled on the test project.

These observations are distinguished from independent hosted SQL/Auth execution, which the assistant has not performed. Manual SQL Editor application does not reconcile CLI migration history. Do not rerun migrations or Cron setup.

## Remaining work

Follow [REMAINING_CHECKLIST.md](REMAINING_CHECKLIST.md) for all remaining steps, explicit wait gates and grouped read-only reports: test Site URL/redirect, Google client/provider, CAPTCHA consistency, private API schema review, public build variables, verified test deployment, first permanent host login/test-only admin grant, laptop/iPhone acceptance, capacity/uniqueness/privacy/reconnection/moderation checks and evidence.

No test URL is claimed live. No production settings/data/keys/Cron/Pages or source PR branches were changed. The assistant's documentation-query validation uses only disposable local in-memory PGlite, never the hosted test or production database.
