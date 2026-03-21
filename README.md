
# YouTube Right Arrow: 2× Fast-Forward

**What it does**
- **Short press →**: emulate YouTube default, seek forward **+5s**.
- **Long press →**: first tries YouTube's native long-press **2×** behavior, then falls back to a built-in temporary speedup if native detection doesn't work. Release restores the previous speed.
- **Overlay**: shows a Bilibili-style top-center hint while the temporary speed-up is active.
- Press **Shift+R** to cycle the temporary speed: **1.5× → 2× → 2.5× → 3×** (saved per browser via localStorage).

**Install as a Chrome extension (Developer mode)**
1. Download and unzip this folder.
2. Open `chrome://extensions`.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** and select the unzipped folder.
5. Open a YouTube video and hold **→**.

**Install as a userscript**
1. Install a userscript manager such as Tampermonkey.
2. Open `youtube-right-2x.user.js`.
3. Confirm installation in the userscript manager.
4. Open a YouTube video and hold **→**.

**Notes**
- It ignores key presses while you’re typing in search boxes or comments.
- It works on `youtube.com`, `m.youtube.com`, and `youtu.be` pages.
- The repository includes both a Chrome extension entry (`manifest.json`) and a userscript build (`youtube-right-2x.user.js`).
- No network permissions are required.
- Native long-press detection on YouTube uses a longer delay than the fallback path, so the very first long-press on a page may activate slightly later while the extension probes whether the native route works.

**Long-press threshold**
- Fallback long-press activation uses **300 ms** by default (`LONG_PRESS_DELAY` in `content.js`).
- Native YouTube detection is probed for about **550 ms** (`SPEEDMASTER_DETECT_DELAY`) before the extension decides to use the fallback path.
