# YouTube Right Arrow: 2× Fast-Forward

English | 中文

Hold the `Right Arrow` key on YouTube to temporarily play at `2×`, then release to restore the previous speed.  
在 YouTube 里长按 `→` 方向键临时切换到 `2×` 倍速，松开后自动恢复原播放速度。

This repository includes both:
- a lightweight Chrome / Chromium extension
- a userscript for Tampermonkey and similar managers
- a Safari Web Extension Xcode project under [`safari/`](./safari)

这个仓库同时提供：
- 轻量级 Chrome / Chromium 扩展
- 可用于 Tampermonkey 等脚本管理器的 userscript 版本
- 位于 [`safari/`](./safari) 目录下的 Safari Web Extension Xcode 工程

## Repository Layout | 仓库结构

- [`manifest.json`](./manifest.json): Chromium / MV3 extension entry
- [`content.js`](./content.js): shared core behavior
- [`youtube-right-2x.user.js`](./youtube-right-2x.user.js): userscript version
- [`safari/`](./safari): Safari Web Extension Xcode project

- [`manifest.json`](./manifest.json)：Chromium / MV3 扩展入口
- [`content.js`](./content.js)：共享核心逻辑
- [`youtube-right-2x.user.js`](./youtube-right-2x.user.js)：用户脚本版本
- [`safari/`](./safari)：Safari Web Extension Xcode 工程

## Features | 功能

- Short press `→`: keep YouTube's default `+5s` seek behavior
- Long press `→`: try YouTube native long-press `2×`, then fall back to built-in temporary speed-up
- Release key: restore the original playback speed
- Overlay hint: show a Bilibili-style top-center speed indicator
- `Shift + R`: cycle temporary speed `1.5× -> 2× -> 2.5× -> 3×`
- No network permissions
- No ads, no tracking, no extra UI clutter

- 短按 `→`：保留 YouTube 默认的 `+5 秒` 快进
- 长按 `→`：优先尝试 YouTube 原生长按 `2×`，失败时回退到内置临时倍速逻辑
- 松开按键：自动恢复原来的播放速度
- 顶部浮层提示：显示类似 Bilibili 的倍速提示
- `Shift + R`：在 `1.5× -> 2× -> 2.5× -> 3×` 之间循环切换临时倍速
- 不需要网络权限
- 无广告、无跟踪、无多余界面

## Supported Browsers | 支持的浏览器

### Extension mode | 扩展模式

- Google Chrome
- Microsoft Edge
- Brave
- Arc
- Vivaldi
- Other Chromium-based browsers with Manifest V3 support

### Userscript mode | 脚本模式

- Tampermonkey
- Violentmonkey
- Other compatible userscript managers

### Safari | Safari 支持

Safari does not load this folder directly like Chrome, but the project can be converted into a Safari Web Extension with Xcode.

Safari 不能像 Chrome 一样直接加载这个目录，但可以通过 Xcode 转成 Safari Web Extension。

## Install as a Chromium Extension | 安装为 Chromium 扩展

1. Download or clone this repository.
2. Open your browser extension page, such as `chrome://extensions` or `edge://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select this folder.
6. Open a YouTube video and hold `→`.

1. 下载或克隆本仓库。
2. 打开浏览器扩展页面，例如 `chrome://extensions` 或 `edge://extensions`。
3. 打开 `Developer mode`。
4. 点击 `Load unpacked`。
5. 选择本项目目录。
6. 打开 YouTube 视频后长按 `→` 即可。

## Install as a Userscript | 安装为用户脚本

1. Install Tampermonkey or another userscript manager.
2. Open [`youtube-right-2x.user.js`](./youtube-right-2x.user.js).
3. Confirm installation.
4. Open a YouTube video and hold `→`.

1. 安装 Tampermonkey 或其他脚本管理器。
2. 打开 [`youtube-right-2x.user.js`](./youtube-right-2x.user.js)。
3. 确认安装。
4. 打开 YouTube 视频后长按 `→` 即可。

## Safari Web Extension | Safari 扩展

If you want to run this in Safari:

1. Install Xcode.
2. Open [`safari/README.md`](./safari/README.md).
3. Open the Xcode project under [`safari/YouTube Right Arrow 2x Safari/`](./safari/YouTube%20Right%20Arrow%202x%20Safari/).
4. Build and run the macOS host app.
5. In Safari, go to `Settings -> Extensions` and enable the extension.

如果你想在 Safari 里使用：

1. 安装 Xcode。
2. 打开 [`safari/README.md`](./safari/README.md)。
3. 打开 [`safari/YouTube Right Arrow 2x Safari/`](./safari/YouTube%20Right%20Arrow%202x%20Safari/) 里的 Xcode 工程。
4. 构建并运行 macOS 宿主 App。
5. 在 Safari 中打开 `设置 -> 扩展`，启用该扩展。

## Search-Friendly Summary | 便于搜索的说明

This project is useful if you are searching for:

- YouTube right arrow 2x extension
- hold right arrow for 2x speed on YouTube
- YouTube long press right arrow speed up
- YouTube temporary 2x playback extension
- YouTube fast forward while holding arrow key
- YouTube 2x userscript
- Tampermonkey YouTube 2x speed script
- Safari Web Extension for temporary YouTube speed-up

如果你在找下面这些东西，这个项目就是对应方案：

- YouTube 右方向键 2x 扩展
- YouTube 长按右键 2 倍速
- YouTube 临时倍速扩展
- YouTube 按住方向键加速播放
- YouTube 2x userscript
- Tampermonkey YouTube 倍速脚本
- Safari YouTube 倍速扩展

## Notes | 说明

- It ignores key presses while typing in comments, search boxes, and other editable fields.
- It works on `youtube.com`, `m.youtube.com`, and `youtu.be`.
- The repository includes both a browser extension entry (`manifest.json`) and a userscript build (`youtube-right-2x.user.js`).
- Native long-press detection on YouTube may trigger slightly later on the first attempt because the script probes whether the native route works.

- 在评论框、搜索框、输入框等可编辑区域输入时，不会拦截按键。
- 支持 `youtube.com`、`m.youtube.com` 和 `youtu.be`。
- 仓库同时包含浏览器扩展入口 `manifest.json` 和 userscript 文件 `youtube-right-2x.user.js`。
- YouTube 原生长按检测第一次可能略慢一些，因为脚本会先探测原生方案是否可用。

## Timing | 时序参数

- Fallback long-press activation delay: `300 ms` via `LONG_PRESS_DELAY` in `content.js`
- Native detection probe delay: about `550 ms` via `SPEEDMASTER_DETECT_DELAY` in `content.js`

- 回退逻辑的长按触发时间：`300 ms`，见 `content.js` 中的 `LONG_PRESS_DELAY`
- 原生检测探测时间：约 `550 ms`，见 `content.js` 中的 `SPEEDMASTER_DETECT_DELAY`

## License

MIT
