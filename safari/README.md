# Safari Version

This folder contains the Safari Web Extension Xcode project for this repository.

## Open

Open:

`YouTube Right Arrow 2x Safari/YouTube Right Arrow 2x Safari.xcodeproj`

## Build

1. Open the Xcode project.
2. Select the `YouTube Right Arrow 2x Safari` scheme.
3. Build and run the macOS app.
4. In Safari, open `Settings -> Extensions`.
5. Enable `YouTube Right Arrow 2x Safari`.

## Notes

- The Safari project references the root extension files such as `manifest.json` and `content.js`.
- Update the Chromium logic once in the repo root, and Safari will pick up the same logic.
- If Safari does not show the extension immediately, quit and reopen Safari after running the host app once.

## 中文

这个目录包含本仓库的 Safari Web Extension Xcode 工程。

## 打开方式

打开：

`YouTube Right Arrow 2x Safari/YouTube Right Arrow 2x Safari.xcodeproj`

## 构建步骤

1. 用 Xcode 打开工程。
2. 选择 `YouTube Right Arrow 2x Safari` scheme。
3. Build 并运行 macOS 宿主 App。
4. 在 Safari 中打开 `设置 -> 扩展`。
5. 启用 `YouTube Right Arrow 2x Safari`。

## 说明

- Safari 工程直接引用仓库根目录下的 `manifest.json`、`content.js` 等文件。
- Chromium 版本逻辑更新一次，Safari 版本会共享同一份核心逻辑。
- 如果 Safari 没有立即显示扩展，先运行一次宿主 App，再完全退出并重开 Safari。
