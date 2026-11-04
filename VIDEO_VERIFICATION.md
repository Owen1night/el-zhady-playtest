# Video collection — isolated draft PR #1

2026-11-04. No merge, deployment, hosted database/Cron operation or Room A change. Review route: `#/videos`; final commit and current CI result are recorded in the PR. Public content remains accessible without an account.

## Exact links and scope

| Requested card title | Exact video | Watch-page title independently returned | Topic use |
| --- | --- | --- | --- |
| Қазақстандықтардың Ұлы Отан соғысы шайқастарына қатысуы | https://www.youtube.com/watch?v=U_m3AiohJNI | Қазақстандықтардың Ұлы Отан соғысы шайқастарына қатысуы | Core wartime topic |
| Алаш қозғалысы және қазақ зиялылары | https://www.youtube.com/watch?v=8VoqgIjK-qw | АЛАШ туралы 5 минут: олар не үшін күресті? | **Background context**, not a replacement for core 1939–1953 material |
| Соғыс жылдарындағы Қазақстан мәдениеті | https://www.youtube.com/watch?v=xavwUCL0OkU | Соғыс жылдарындағы Қазақстан мәдениеті (1941-1945) | Core wartime culture topic |
| Соғыстан кейінгі Қазақстан: 1946 жыл | https://www.youtube.com/watch?v=0xW-wV9tGDI | 1946 жыл \| «Тарих толқынында» бағдарламасы | Core postwar topic; [portal source](https://e-history.kz/kz/video/show/34042), Қазақстан Тарихы, 2024-06-28 |

The owner supplied the original three IDs. The additional postwar ID comes from the Qazaqstan tarihy portal’s actual embedded player and was matched to the Қазақстан Тарихы channel entry. The initially discovered f9SqQVKWFsQ classroom repost identifies Bilimland as its origin; it was not selected when the portal-linked programme became available. Canonical watch URLs preserve their case and remove only `si` sharing/tracking parameters. The available web tool successfully opened all four `youtu.be` links and resolved their YouTube page titles. Earlier direct watch/oEmbed attempts were throttled or inaccessible. This establishes link/title availability from that tool, **not continuous playback, duration, transcript accuracy, country/device restrictions or permission to embed**; the uploader is independently identified only for the added Қазақстан Тарихы programme.

The Алаш classification is a conservative editorial decision based on the introductory movement-focused title/topic, not a claim to have watched/reviewed the whole film. Keep its background label visible. It can introduce the history of intellectual life, and does not count toward the three core videos. The selected «1946 жыл» programme completes that topical lineup. Full content review might identify useful specific connections; no timestamps or quotations are invented. The 1946 programme’s published description addresses postwar economic difficulties and their effect on Kazakhstan, which fits the 1939–1953 scope. It concerns 1946, not a claimed survey of every year through 1953. The portal’s USSR-wide numerical statements are not republished as Kazakhstan statistics or added to the 30-fact ledger. We link/embed the provider-managed video; no footage or portal article is copied/rehosted.

## Actual player behavior

- Original requested card titles retained; source/original YouTube title and a visible >=44px **YouTube-де ашу** link on every card, including loading/error states.
- **Осы бетте ашу** loads the official YouTube IFrame API once on explicit action. Player host is `youtube-nocookie.com`; autoplay=0, controls=1, playsinline=1, fullscreen enabled and actual page origin supplied. No visitor account/API key, video download or rehosting; no invented reuse licence.
- Minimum 200×200 player viewport, proportional responsive layout, readable phone/tablet/desktop captions. Opening the player does not automatically play audio/video.
- Official errors 100 (unavailable), 101/150 (embedding refused), 153 (referrer/identity verification) show understandable Kazakh messages, retry and persistent YouTube links. API/network failure and a player that never becomes ready time out; no endless spinner. Closing/navigating away destroys the player. Stale callbacks cannot reopen a closed player.
- Creator is recorded only for the independently identified Қазақстан Тарихы channel; unknown creators, durations and transcripts remain null, not invented metadata. Captions/transcript review and actual physical-device playback remain pending. `pageCheckedOn` and `playbackCheckedOn` are distinct.

## Tests and limits

Type/content checks, source-reference resolution, canonical-ID validation, private-bank/build guards and affected public layouts are rerun. `npm run test:videos:browser` exercises each card from opening through closing, exact fallback-link popup navigation, SDK sharing, refusal/removal errors, retry, network recovery, stalled-readiness timeout, inline/control/no-autoplay parameters, minimum player size and no overflow at 360/768/1920px. `BROWSER=webkit` selects WebKit when available; current-head CI runs both engines.

**Browser SDK/watch/embed responses in these tests are explicit offline fixtures.** They verify our controls, URLs, errors, cleanup and layout; they are not fake evidence of live YouTube playback. Separate actual watch-page URL/title checks above use the web tool. Local checks passed the full 12-file test suite, type/content/media/frozen-bank checks and static build. Chromium video lifecycle checks passed at 360/768/1920px. Visual inspection caught a 377px-wide stage on a 360px phone: explicit player width/min-width fixed it, and overflow checks now compare to the configured viewport instead of the mobile-expanded innerWidth. A parallel local public-page run timed out navigating home; it was rerun separately after the other jobs completed. Current-head CI and final layout outcomes are linked in the PR after completion; no earlier green run is substituted for a new head.

A physical iPhone Safari/Android and laptop should still open each of the four YouTube links, allow third-party playback, press play, check inline/fullscreen, captions/audio, and exercise provider refusal/blocker/offline fallback. The app handles provider restrictions but cannot override them. Four connected URLs, including three core selections, are not recorded as independently verified full playbacks.

[Initial real application cards and explicitly simulated player/error screenshots](review/videos/README.md).
