# my-video — مقاسات الطباعة · تكوين

Vertical video (1080×1920, 30fps, ~50s) built with Remotion from the Takwin print-sizes script.

- `src/timing.ts` — every cue time (seconds), synced to `public/voiceover.mp3`. Edit here to re-sync.
- `src/Sound.tsx` — voiceover + background SFX/music (`SFX_VOLUME`, `MUSIC_VOLUME` kept very low).
- `scripts/make_sfx.py` — regenerates the synthesized SFX and music bed in `public/sfx`.

```bash
npm install
npm run dev      # Remotion Studio
npx remotion render TakwinSizes out/takwin-sizes.mp4
# in this container: add --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```
