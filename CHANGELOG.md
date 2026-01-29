# Changelog

All notable changes to the **Kenichi Lite** project will be documented in this file.

## [0.1.0] - 2026-01-29

### Features
- **Video Metadata**: Implemented robust, crash-free video metadata display (resolution, duration, size) in the footer.
- **Playlist & Filmstrip**: Added playlist support with a dockable filmstrip UI and mixed media (image/video) handling.
- **Keyboard Shortcuts**: Implemented global keyboard shortcuts for media control (Space, Arrows, F, M, etc.).
- **UI Overhaul**: Redesigned tailored "Pro Gray" theme, custom frameless title bar, and polished "Photos-app" style UI.
- **Tauri V2 Init**: Initialized project with Tauri v2, React, Vidstack, and a custom high-performance streaming protocol (`http://media.localhost`).

### Refactor
- **UI Polish**: Refined opening screen, navigation arrows, and unified footer design.
- **Metadata Logic**: Switched from unstable hooks to direct player subscriptions for reliable metadata updates.

### Fixes
- **Video Playback**: Resolved "black screen" crash caused by `useMediaState` hook issues.
- **Metadata**: Fixed missing or inconsistent resolution/duration display for video files.
