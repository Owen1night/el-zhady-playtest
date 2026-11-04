# Solo practice — review and later isolated setup

**Draft PR only. Do not execute setup as part of this implementation task.** No merge, Pages deployment, hosted SQL, Cron changes or deletion of Room A occurred. The existing published isolated site does not contain this draft frontend. Production is outside scope.

## New backend contract

The only new migration is `supabase/migrations/20261103000500_solo_practice.sql`. It is pending manual review/application; the seven previously applied files are unchanged. It adds private `practice_sets` and `practice_attempts` with RLS/revoked browser table access and five public authenticated RPCs: `practice_begin`, `practice_state`, `practice_save`, `practice_submit`, `practice_reset`. All independently require a permanent account. Guest practice access fails server-side. No existing live RPC, room, result, scheduler or Cron definition is changed.

Five real activities reuse the sourced mixed-v3 quiz/map items and frozen additional material in `supabase/content/solo-v1.json`. Run `npm run check:solo-content` to compare that authoring input with the pending versioned SQL. Do not import this bank into `src`. New draft answer keys and explanations are supplied by SQL only after that owner's attempt is complete; live answer/reveal/privacy contracts stay unchanged. Public source code is not a proctored-exam secret.

- Quiz, matching, map, classification: five answers × 4 points = 20.
- Chronology: five event positions × 4 points = 20; exact position partial credit is stated in the UI.
- No speed bonus, no completion bonus, no timer. Maximums are comparable; activity difficulty still needs teacher review.
- Profile stores each activity's best completed score, five /20 slots and /100 sum. Current attempt displays its own real score, including a lower retry score. Live competition results and rankings never enter practice totals.
- Server stores frozen attempt items, drafts and completion. One active attempt per account/activity survives refresh and different browser storage. UUID retry hints are optional local browser state; no local mock scores. Advisory/row locks and uniqueness prevent racing begins/submits from duplicating or changing a completed result.
- Autosave is debounced and submission sends the current answers explicitly. Retry preserves answers and repeats the failed action. Reset asks for confirmation and deletes only that permanent user's practice attempts/results; completed competition results remain.

## Later owner action, only after separate approval

1. Use only [el-zhady-playtest SQL Editor](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/sql/new). Confirm the project name/reference. Do not select production.
2. Review the pinned draft migration in GitHub. Paste that complete **new** file once into a new SQL query and Run. Expected: `Success. No rows returned.` Do not rerun the original seven migrations or scheduler setup. Reconcile manual migration history separately before any future CLI workflow; do not blanket `db push`.
3. Read-only schema/seed checks:

```sql
select to_regclass('el_zhady_private.practice_sets') as sets,
       to_regclass('el_zhady_private.practice_attempts') as attempts;
select activity_id, version, jsonb_array_length(items) as item_count
from el_zhady_private.practice_sets order by activity_id;
select relname, relrowsecurity
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='el_zhady_private'
  and relname in ('practice_sets','practice_attempts');
select has_table_privilege('authenticated','el_zhady_private.practice_sets','select') as can_read_keys,
       has_table_privilege('authenticated','el_zhady_private.practice_attempts','select') as can_read_attempts;
```

Expected: both relations exist; five `solo-v1` rows (ordering 1 item with five events, other types 5 items); both RLS flags true; both privilege flags false. Keep private schema outside Data API exposed schemas. No Cron change is needed.
4. Review/approve the matching frontend separately. This task has not deployed it. Test-only [Actions](https://github.com/Owen1night/el-zhady-playtest/actions), repository [Pages settings](https://github.com/Owen1night/el-zhady-playtest/settings/pages) and public build variables remain as previously configured. Never use production variables or service-role keys. The manual-only isolated Pages workflow remains unchanged.

## Acceptance after a later approved isolated deployment

- Laptop: permanent Google login in the isolated site; profile name persists. Open Ойындар. Complete each of five activities and inspect chosen/correct answers, explanations, sources and the actual /20 result. Retry lower: profile best must remain higher.
- iPhone Safari: same permanent account in another session/device. Check all five /20 slots and /100 total against the laptop. Start an unfinished game, answer, wait for **«Жауаптар серверде сақталды»**, refresh and resume. Repeat at least one activity by keyboard on laptop.
- Matching: person first, then achievement; assigned achievement remains visible and uniqueness holds. Chronology: up/down buttons, no dragging. Map: 44px markers or equivalent labelled buttons, no hover required. Quiz/classification: native answer buttons. Submit only when complete. Wrong answers score zero; a displaced chronology event earns zero for that position.
- Reset: cancel once, then confirm; only practice clears. Existing competition history and Room A must remain. Sign out / anonymous guest cannot open practice; room-code guest entry remains available without projector mode.
- Readings: inspect all seven portraits, captions/credit links, the 1995 Мәншүк stamp and each event visual at narrow width. Three period markers must be visible/tappable with one clear selected state. Test portrait/landscape and larger Safari text.
- Projector: desktop labelled header control; phone toggle only in Бөлімдер. Banner exit always available. Preference survives refresh; exit restores normal layout. No fullscreen, identity, room, start, join or score logic depends on it.
- Live regression: host normal mode → guest QR on iPhone → quiz/map/timeline; early-end current question, accepted answers retained, normal reveal, stale double click cannot shorten the next full timer; host starts each round/reveals final results; player results stay private.
- Real Google redirects, Safari background/resume, flaky Wi-Fi/autosave retry, physical VoiceOver/touch and cross-device hosted persistence remain physical/hosted acceptance. Local fixture tests do not verify these external services.
