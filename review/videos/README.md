# Video-card review screenshots

This revision keeps all three supplied URLs, adds the source-linked 1946 programme, and separates **3 core selections + 1 Алаш background**. These images are local browser emulation, not a new public deployment or physical iPhone test.

- [360px phone: full collection](collection-360.png)
- [768px tablet: full collection](collection-768.png)
- [1920px host display: full collection](collection-1920.png)
- [Simulated provider refusal at 360px](provider-refusal-fixture-360.png): explicit offline SDK/error fixture, **not a claim that YouTube actually refuses this video**. It verifies the Kazakh error, Retry and always-visible original link.

The collection images show the real initial click-to-load cards without external players loaded. Browser tests separately instantiate player fixtures and check all four exact fallback destinations, inline/control/no-autoplay configuration, refusal/removal/network/timeout handling, retry/recovery, close and cleanup. They do not prove real streaming. All four real YouTube watch pages were opened with matching titles using the available web tool; full playback/permission/captions remain unverified.

[Video links/source audit and test limits](../../VIDEO_VERIFICATION.md) · [Manual later deployment instructions](../../PLAYTEST_DEPLOYMENT.md).
