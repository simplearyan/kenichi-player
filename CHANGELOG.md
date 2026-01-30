# Changelog

All notable changes to the **Kenichi Lite** project will be documented in this file.

## [0.1.1] - 2026-01-30

### Features
- **Window Fullscreen**: Implemented unified, window-level fullscreen support that works for images, videos, and audio.
- **Audio Visualizer**: Added a dynamic, responsive audio visualizer for a more engaging audio playback experience.
- **Pro Icon Set**: Upgraded core UI icons to a more professional set (Library, Clapperboard, MonitorPlay, Expand).

### UI/UX
- **Branding Polish**: Redesigned TitleBar with premium bold typography, logo glow effects, and improved layout spacing.
- **Cinematic Transitions**: Added smooth CSS-based fade and slide animations for TitleBar visibility changes.
- **Polished Tooltips**: Added custom, dark-themed tooltips with shortcut hints across all footer actions.

### Stability & Fixes
- **Media Switching**: Resolved state leakage and race conditions when switching between different media types (image/video/audio).
- **Hook Reliability**: Refactored `useMediaMetadata` and `useMediaShortcuts` for safer state handling and better error resilience.
- **Permissions**: Fixed Tauri capability errors by explicitly granting `allow-set-fullscreen` permissions.

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
