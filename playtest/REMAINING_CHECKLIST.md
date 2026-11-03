# Remaining isolated laptop/iPhone playtest checklist

Scope: only `Owen1night/el-zhady-playtest` and Supabase project **`isufimcphbxhkmrquocc`**. Application/migration source remains PR #6 commit `465574fcc86f44b9d166c998c28a2e0d00a73b25`. Both source PRs stay draft/unmerged. Production Supabase, Cron and Pages stay unchanged. No playable test deployment is claimed yet.

## Already completed — do not repeat installation

- Repository created, integration access granted, isolated manual Pages workflow copied; owner reports Pages source is GitHub Actions.
- Owner reports all seven pinned migrations ran successfully once in the new test project. Do not rerun them or use `db push`.
- Owner enabled test Cron and ran its scheduler setup once. Screenshots show both named jobs active with correct schedules, quiz tick command correct, five successful approximately one-second ticks, and cleanup-command equality true. Owner reports scheduler readiness true.
- Owner reports mixed-bank counts/distinct counts map10/10, quiz30/30, timeline10/10; early-timeout RPC/security check returned RLS true and unauthenticated anon execute false.
- Screenshots show the four administrator-only raw-result SELECT policies and exactly four public Realtime tables, with no result/private tables published.
- Owner reports test anonymous sign-ins enabled.

These are owner reports/screenshots, not assistant SQL execution. The daily cleanup's definition was checked; a successful daily cleanup execution has not been observed. Live gameplay and actual hosted Auth remain untested. Existing [PR #6 CI](https://github.com/Owen1night/el-zhady/actions/runs/41623678266) passed for the pinned source; its local database/browser fixtures are separate evidence.

## 1. Finish test Auth configuration

These settings can be prepared independently of GitHub build variables in step 2. No need to send a message between each setting; report the configuration group together.

1. Open [test Authentication → URL Configuration](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/auth/url-configuration). Set **Site URL** to the following, save, then **Redirect URLs → Add URL**, add the same exact value and save:

   ```text
   https://owen1night.github.io/el-zhady-playtest/
   ```

   The trailing slash matters. Do not add a hash route as a callback or use localhost.

2. For the short controlled test, open [test Authentication → Attack Protection](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/auth/protection) and confirm CAPTCHA protection is **off on this new test project**, leaving default rate limits unchanged. The matching test Turnstile variable stays absent. If you choose CAPTCHA instead, configure a separate test widget/secret in test Supabase and its matching public site key; stop if those do not agree. Production CAPTCHA stays as configured.

3. Open [Google Auth Platform → Clients](https://console.cloud.google.com/auth/clients). Select the Google Cloud project where your test Google account/consent configuration already exists. Create a **new** client: **Create client → Web application**, name **`el-zhady-playtest`**. If using the older console: **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application**. In this new client set:

   | Field | Exact value |
   |---|---|
   | Authorized JavaScript origins | `https://owen1night.github.io` |
   | Authorized redirect URIs | `https://isufimcphbxhkmrquocc.supabase.co/auth/v1/callback` |

   Create/save the client. Do not edit the production OAuth client. If the console requires initial consent setup, use an External/Testing test application and allow the host's Google account. Otherwise inspect the existing [Audience → Test users](https://console.cloud.google.com/auth/audience) list and confirm your host account is already allowed; do not change an existing production application's audience/publishing status. For an additional permanent player, that separate Google account must also be allowed. Standard `openid`, email and profile access is sufficient; no extra API scopes are needed.

4. Open [test Authentication → Sign In / Providers](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/auth/providers) → **Google**. Enable Google, paste the **new test client's** Client ID and Client Secret into their matching fields, and **Save**. The callback shown there must match the URI above. Keep the secret only in test Supabase; do not send it in chat or put it in GitHub.

5. Independent read-only settings review: open the [test project](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc) → **Project Settings → Data API → Exposed schemas**. Confirm **`el_zhady_private` is absent**. Keep the existing permitted schemas; if the private schema is exposed, stop and report it before deployment.

Expected group: exact test Site URL/redirect saved, anonymous sign-ins on, Google enabled with the new callback, host allowed by Google Testing, test CAPTCHA/key choice consistent, private schema unexposed. Do not change email/password setup for this test.

## 2. Public variables in the test repository

Open [test repo → Settings → Secrets and variables → Actions → Variables](https://github.com/Owen1night/el-zhady-playtest/settings/variables/actions). For each value use **New repository variable → Name / Value → Add variable**, or edit the same variable if already present.

| Name | Value |
|---|---|
| `PLAYTEST_SUPABASE_URL` | `https://isufimcphbxhkmrquocc.supabase.co` |
| `PLAYTEST_SUPABASE_PUBLISHABLE_KEY` | Copy the test project's modern public `sb_publishable_…` key from [test Project Settings → API Keys](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/settings/api-keys). Create a publishable key there if none exists. |
| `PRODUCTION_SUPABASE_PROJECT_REF` | The **existing production** project's real public project reference, used only as a refusal guard. Read its dashboard URL via [Supabase Dashboard](https://supabase.com/dashboard), open **el-zhady**, copy only the ID following `/project/`. Do not change that project. This value must differ from `isufimcphbxhkmrquocc`; do not enter a dummy value or the test reference. |
| `PLAYTEST_TURNSTILE_SITE_KEY` | Leave absent for the CAPTCHA-off test. If test CAPTCHA is on, use that test widget's public site key. |

The workflow derives the test site URL automatically; no extra `VITE_*` variables need copying here. Use the public publishable key, never `sb_secret_…`, `service_role`, OAuth secrets or database passwords. No key value needs sending in chat. [Supabase key guidance](https://supabase.com/docs/guides/getting-started/api-keys).

**WAIT A:** wait for the Google/Supabase saves and all step 1–2 settings to match before running deployment. You can report their independent read-only reviews together and proceed to step 3 when they match; no separate approval message is required. If any setting fails, stop at it. Auth provider settings are owner-configured, not verified merely by a saved variable.

## 3. Deploy only the isolated test frontend

1. Open [test Actions → Deploy isolated playtest](https://github.com/Owen1night/el-zhady-playtest/actions/workflows/pages.yml).
2. **Run workflow → Branch: main → Run workflow**. Confirm the repository heading says `el-zhady-playtest`.
3. **WAIT B:** both build and deploy jobs, including the final public verifier, must succeed. If anything fails, send the run URL and failure text and stop. Do not rerun SQL or weaken the guards to make deployment pass.
4. Expected public URL, only live after deployment/checking: [https://owen1night.github.io/el-zhady-playtest/](https://owen1night.github.io/el-zhady-playtest/). The workflow summary must show HTTP200/SHA-256 verification for all assets and the **test repository's deployed commit**. Open [deployment.json](https://owen1night.github.io/el-zhady-playtest/deployment.json); its commit must equal that workflow's head SHA. That SHA differs from the pinned application-source SHA because test setup/docs are additional commits.
5. Independent read-only browser review, report together: laptop and iPhone Safari both load the real URL; banner says **ISOLATED PLAYTEST**, correct test repository and `isufimcphbxhkmrquocc`; all assets/fonts/map contours load; public readings/timeline/atlas work signed out; desktop/mobile **«Ойынға қосылу»** reaches the code form. No source-repo/production deployment should run.

The verifier establishes static serving and exact bytes, not working hosted Google Auth or multiplayer. [GitHub Pages workflow reference](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 4. Permanent host login, persistence and test admin grant

1. Laptop: open [test profile](https://owen1night.github.io/el-zhady-playtest/#/profile), choose **«Google арқылы кіру»**, use the allowed Google account, create a Kazakh display name and save it. Expect redirect back under **`/el-zhady-playtest/`**, not production or a 404. Check intended destination is restored after the required first profile setup. Never copy OAuth codes/tokens into a report.
2. Independent read-only/normal-account checks, report together: refresh retains name; edit/save name, refresh again; sign out, sign back in and recover the same profile. Practice remains five empty **— /20** slots and **— /100**, with no invented results. Before the admin grant, [test admin](https://owen1night.github.io/el-zhady-playtest/#/admin) must deny access. A host who only hosts will not earn a player competition history entry.
3. **WAIT C:** only after successful permanent Google login, open [test Authentication → Users](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/auth/users), open your new Google user and confirm it is not anonymous. Copy this **test project's** Auth UID. Do not use the production UID or a display name.
4. In [test SQL Editor → New query](https://supabase.com/dashboard/project/isufimcphbxhkmrquocc/sql/new), with the test project name/reference confirmed, replace the one placeholder and run:

   ```sql
   do $$
   declare v_user uuid := 'REPLACE_WITH_TEST_AUTH_UID';
   begin
     if not exists(select 1 from auth.users where id=v_user and is_anonymous is false) then
       raise exception 'A permanent authenticated account is required';
     end if;
     insert into el_zhady_private.admins(user_id) values(v_user)
       on conflict(user_id) do nothing;
   end $$;
   ```

   Expected **Success. No rows returned.** No admin password or browser-side role assignment is involved.

5. **WAIT D:** refresh the test site (sign out/back in if necessary) and open the admin URL above. Room-creation controls must now appear. If they do not, stop and send the error; do not grant a guest or change production.

## 5. Devices and room plan

- Use laptop normal browser as permanent admin host and a **physical iPhone → Safari normal browsing tab** as a genuine anonymous guest. Record iPhone model/iOS/Safari and laptop browser/version. Android, if available, is a separate physical check; Chromium 360px emulation is not Safari evidence.
- A separate laptop private window can be a second guest for duplicate-name/unanswered checks and keyboard gameplay. Give both guests the same display name once. Use an additional **non-admin permanent Google account** if you want hosted registered-player history checks; the admin host is excluded from the roster. If that account is unavailable, mark registered-player history testing **not run** rather than treating the host's empty history as failure.
- Use up to four test rooms: **A mixed** (main acceptance), **B three quiz rounds** (uniqueness), **C capacity/moderation** (negative flows), **D natural expiry/offline/cancellation**. Host creation is limited to five new rooms per hour. Retries of the same pending request must reuse its room, not consume another new room.
- Keep rooms A/B until the grouped post-play SQL is collected. Do not delete them first.

## 6. Main mixed room A: invitation and live lobby

1. Laptop [admin](https://owen1night.github.io/el-zhady-playtest/#/admin): set a title, **«Бөлмені дайындау» → «Бөлмені ашу»**. Select **«Сұрақтар жинағы»** = the **50-task** `kz-1939-1953-mixed-v3` bank. **«Ойындар реті»** = **«Ұсыныс: викторина → карта → хронология»**. Click **«Ойындар ретін сақтау»** and wait until the server-saved lineup shows all three in order. Refresh host once; the lineup must remain the same.
2. Choose **«QR-кодты үлкейту»**. Check the printed URL starts `https://owen1night.github.io/el-zhady-playtest/#/join?code=…`. Record room A's actual eight-character code. X/Escape closes the QR and returns to the same room. Projector/large-display mode and text must be readable.
3. iPhone Camera scans QR → open in Safari; code is prefilled. Enter a display name → **«Сайысқа қосылу»**. No Google/email is required. Host and phone should update to the same participant list. Refresh phone in the same context: same participant ID/membership, no duplicate record. Join with a second guest of the same name if available; distinct **ID** hints identify them, with no join-order **#1** rank. Emails/Auth user IDs must not appear in lobby/podium. Note whether connection status is live or polling; recent activity is not a guarantee of presence.
4. Open profile/admin as that guest: no permanent profile, practice or admin privileges. Return to the same lobby. In another fresh session, cancel a Google login and verify room-code guest entry is still offered. If Google fails, public sections and guest entry must remain available.

**WAIT E:** do not start until saved lineup, host admin access and at least one real guest work. Save room codes before proceeding.

## 7. Quiz → map → timeline acceptance

1. Host **«Сайысты бастау»**: expect three-second countdown; host has no answer controls. Late newcomers must be rejected from now through between-round waiting. All players see the same question/order. No question repeats anywhere in this room; reservations persist across refresh/retry.
2. Quiz question 1: iPhone submits an answer and waits for **«Жауап серверде сақталды»**. Refresh while the question is still open: same accepted choice/ID returns and cannot be replaced. Keep another guest unanswered if available. Host clicks **«Сұрақты аяқтау»** while time remains. New submissions close server-side; both devices show the **normal five-second explanation reveal** on their next update. Accepted correct answers retain accuracy/speed; wrong/unanswered get zero. Record what was accepted and the revealed score.
3. Let question 2 run its natural 15-second window. It must start with its full configured window; a first displayed timer slightly below 15 due to network delay is acceptable. The private post-play timing report checks the actual interval.
4. On question 3, submit/acknowledge an answer and double-click **«Сұрақты аяқтау»**. Expect one reveal, one next question and no skipping/double-scoring. Let question 4 run normally: full15-second window, no unintended early cut. Button must appear only on host during accepting phase, not on guests/countdown/reveal/waiting screens. A stale packet/double backend call is a separate CI assertion, not proved by two UI clicks when the second is disabled.
5. Complete the quiz, covering accepted correct, accepted wrong and unanswered cases when possible. Players wait without a table; host sees standings. Refresh both in waiting: **map must not start itself**. Host explicitly clicks **«Келесі ойынды бастау»**.
6. Map: ten tasks, **25 seconds** each. Use a marker for one question and equivalent list choice for another; use Tab/Enter from a laptop guest context to test keyboard input. Refresh after acceptance. Early-end one map question; both screens show the correct-location reveal and next question's full25-second configured window. The map is schematic; decorative route lines are not troop movements.
7. Repeat the manual between-round waiting/start test. Timeline: ten tasks, **40 seconds** each. On iPhone use up/down controls and **«Ретті жіберу»**; test Tab/Enter/Space in another guest context. No dragging is required. Refresh after acceptance; saved order persists. Early-end a timeline question; expect the normal ordered reveal and next full40-second window. Only the entire correct order scores; no partial credit.
8. Close the host tab during an accepting question, leaving the phone visible. The phone must reach deadline/reveal/next question under Cron. Reopen the host's exact lobby URL and recover the current state. Briefly disconnect the phone, then reconnect: current phase and prior accepted answer recover; missed questions get zero without shifting the schedule. A hidden/sleeping Safari tab need not animate while suspended; it must resync when visible.
9. After all rounds, players wait with no final standings. Host clicks **«Нәтижені көрсету»**. Expect podium plus each player's own result only; full table stays host-only. Earned ranks use **«2-орын»**, not join ordinals. Refresh after reveal: same settled results, no reveal replay. Test Reduce Motion (iPhone Settings → Accessibility → Motion → Reduce Motion) and narrow portrait layout; return to the site afterward. Check no horizontal overflow, readable timer/progress, touch targets, focus, map/list and dialog operation. No auto audio.
10. Scoring expectations: every game max **11,000**, mixed total max **33,000**, separate from practice /100. Correct =1000 plus floor(100 × fraction of original window remaining), wrong/unanswered0. Halfway gives50 speed in all three kinds. Ranking compares total correct first, speed second; exact ties share a place. Equal maxima do not establish equal task difficulty. Inspect source-linked reveals and host per-question review; do not expect a guessed fixed score.

**WAIT F:** retain room A. If early finish loses an accepted answer, skips a question, cuts the next timer, discloses standings early or auto-starts the next round, stop and report before treating acceptance as passed.

## 8. Other planned checks

These test rooms are independent after the main join/admin path works. Report them together; do not modify the bank or use test clock/bootstrap SQL in hosted Supabase.

| Room/check | Actions and expected result |
|---|---|
| B: three quiz rounds | New room →50-task bank → **«Тек викторина» →3 кезең** →save. Join, start, refresh/retry ordinary UI operations and manually start each later round. There must be30 distinct questions across all three rounds; collect the SQL report. Room A's quiz questions may recur in B, because reuse across rooms is allowed. |
| C: insufficient bank | On a fresh unstarted room select the old20-question bank, quiz-only,3rounds. Expect capacity warning and disabled **«Ойындар ретін сақтау»**; no round starts, no repeat-fill. Map/timeline twice in a custom lineup must also be rejected/unsavable. The backend shortage/atomic rollback tests remain CI evidence unless exercised through an authenticated hosted request; the disabled button alone proves only client prevention. |
| C: joining/moderation | Before start, lock joining: newcomer rejected, existing member refresh allowed. Unlock: newcomer can join. Invalid code/name gives a useful error. Remove one of two same-named guests: that identity loses access through refresh and needs explicit rejoin while open; other guest unaffected. Block it: same identity cannot rejoin even with a changed name. Do not claim a newly created anonymous identity is the same blocked person. Guest attempts admin URL remain denied; no host controls appear. |
| D: natural expiry/errors | Configure one quiz, compare natural timeout reveal/next15-second interval with room A's early finishes. Use a temporary device disconnection to check Kazakh error/retry/resync. Leave one guest unanswered. Test host-tab-independent progression. Do not turn off the backend or alter test/prod keys to manufacture an outage. |
| Registered player/history | If a second non-admin permanent Google account is available, join using it without creating an anonymous identity. Profile/history stay private; revealed competition is separate from practice and persists after sign-out/in. Host-only account has no player score. Guests get no permanent profile and their named result must never attach to an account simply because display names match. |
| Closure/deletion | Use C/D after collecting desired evidence. **«Бөлмені жабу» →Растау** is final, cancels unfinished play, redirects/rejects connected and refreshed clients. Only then **«Бөлмені біржола жою»** with confirmation. Old code/QR must fail; existing earned registered history/practice/accounts remain. Never delete A/B before their reports. |
| Visual/accessibility | Laptop projector/large display and physical narrow iPhone; both menus, public timeline filters/atlas, QR fullscreen/Escape, touch/keyboard, readable timers/progress/reveals, reduced motion and no auto audio. Record Android separately if available; mark unavailable physical devices not run. |

Do not force tied scores by SQL. Inspect ties if they occur; tie ranking and accuracy-before-speed are also covered by CI.

## 9. Grouped read-only post-play evidence

Before room deletion, run [verify-playtest-room.sql](verify-playtest-room.sql) in the **test SQL Editor** after replacing `REPLACE_WITH_TEST_ROOM_CODE` with room A's real code. It is one read-only query returning one JSON report; copy the full cell value so no intermediate query result is lost. Repeat for B after its first start/after completion as needed.

Expected main mixed A: three configured rounds with quiz15/map25/timeline40; ten stored/reserved tasks each,30 unique room reservations; no duplicate accepted answer keys; non-early-ended questions have full configured intervals; gap to each next question5 seconds; saved answers match their original-window scoring, including after early cut. In the timing list, A's quiz questions2/4 have no early cut if the steps were followed. Completed result totals match persisted accepted answers. B must also have30 room-unique quiz draws across three rounds. A/B question reuse is permitted. Preserve the room codes; this report does not publish answer keys, emails or Auth UIDs.

The report's NULL score comparison means no relevant accepted/completed rows yet, not a pass. A zero-row/empty target means wrong/deleted room code. Server timing and scoring reports corroborate the device observations; they do not prove all possible races.

Review [current pinned CI](https://github.com/Owen1night/el-zhady/actions/runs/41623678266) together with hosted evidence: independent PostgreSQL connections check guest/nonadmin early-end denial, duplicate/stale targets after advancement, natural-expiry boundary, concurrent answer/end/Cron behavior, no double scoring, full next windows, shortage rollback/copy-ID uniqueness, profile/RLS/admin isolation, and result privacy. Its three browser contexts test full30-task play. These are automated isolated checks, **not physical Safari or hosted hostile-request verification**. Record any hosted direct-RPC abuse checks not actually performed as not run; never paste JWTs/tokens into reports.

## 10. Report and release boundary

Send one combined report: configuration group (without secrets), workflow URL/deployed test SHA, laptop+iPhone models/versions, room A/B/C/D codes, outcomes of the numbered game checks, full read-only JSON reports, and any failed/not-run checks. For a failure include game/round/question, expected vs actual, visible Kazakh error and a screenshot if useful; omit tokens/private headers/credentials.

Wait for review before production changes. A successful test deployment is **not permission to merge PR #5/#6 or deploy production**. No installation/scheduler setup is to be repeated. Cleanup of this disposable project/site is a later explicit action, not part of this checklist.
