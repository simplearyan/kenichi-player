# Kenichi Lite Roadmap 🚀

This document outlines the development stages and future goals for Kenichi Lite, a modern, minimalist media player built with Tauri, React, and Vidstack.

## Phase 1: Core Player & UI (Completed) ✅
Focus: Establishing a stable, performant media player with a premium aesthetic for low-end PCs.

- [x] **Tauri + React + Tailwind Stack**: Optimized environment for high performance.
- [x] **Vidstack Integration**: Robust media playback engine.
- [x] **Mixed Media Support**: Unified viewing experience for both video and images.
- [x] **Modern Title Bar**: Custom frameless title bar for an app-like feel.
- [x] **Filmstrip Playlist**: Docked, scrollable preview strip for browsing folders.
- [x] **Glassmorphic UI**: Pro Gray theme with unified footer and navigation arrows.
- [x] **Keyboard Shortcuts**: Space (Play/Pause), Arrows (Seek/Navigate), M (Mute), etc.

## Phase 2: FFmpeg Integration (In Progress) ⚙️
Focus: Enhancing deep technical capabilities and visual previews using the FFmpeg backend.

- [ ] **FFmpeg Sidecar**: Bundling the FFmpeg binary with the Tauri application.
- [ ] **Dynamic Thumbnail Generation**:
  - Replace generic icons in the filmstrip with actual video frame previews.
  - Implement a caching system for generated thumbnails to ensure zero lag.
- [ ] **Deep Metadata Extraction**:
  - Display actual video codecs (H.264, HEVC, etc.).
  - Show precise bitrates and color space information (e.g., HDR/SDR).
- [ ] **Enhanced Seeking**:
  - Implement frame-accurate "hover seek" previews on the timeline.
- [ ] **Audio Visualization**:
  - Real-time waveform generation for audio-only files.

## Phase 3: Advanced Features & Optimization (Future) ✨
Focus: User experience refinements and power-user tools.

- [ ] **Global Hotkeys**: Control playback even when the app is minimized.
- [ ] **Advanced Vidstack UI Enhancements**:
  - **Interactive Seek Previews**: Show frame-accurate thumbnails when hovering the progress bar (pairs with FFmpeg).
  - **Chapters & Markers**: Visual segments in the `TimeSlider` with title overlays.
  - **Settings Menu System**: Sleek gear-menu for Playback Speed, Audio Tracks, and Quality selection.
  - **High-Fidelity Tooltips**: Premium text bubbles for all interactive buttons.
  - **Styled Captions**: Rounded, translucent subtitle rendering matching the Pro Gray theme.
  - **Robust Key Management**: Global management of keyboard events to prevent browser conflicts.
- [ ] **Picture-in-Picture (PiP)**: Dedicated minimalist PiP mode.
- [ ] **Theme Studio**: Custom accent colors (beyond brand-yellow).
- [ ] **Subtitle Management**: Advanced sidecar subtitle loading (.srt, .vtt).
- [ ] **Hardware Acceleration**: Deep integration with GPU decoding for ultra-smooth 4K playback.

## Phase 4: Creative Editing Suite (Future) 🎨
Focus: Beyond just viewing—allowing users to create and modify media in-app.

- [ ] **Photo Editor Integration**:
  - **Crop & Rotate**: Precision tools for reframing images.
  - **Annotation Layer**: Drawing, shapes, and text overlays (using Canvas/Fabric.js).
  - **Color Correction**: Basic Brightness, Contrast, and Saturation sliders.
- [ ] **Video-to-Edit Workflow**:
  - **Frame Capture**: Instant high-quality screenshot from the current video playhead.
  - **Snapshot Gallery**: Temporary staging area for captured frames.
  - **Annotate & Save**: Directly send video frames to the photo editor for markup.
- [ ] **Export Options**: Save modified media back to disk or share instantly.

---
*Last Updated: January 29, 2026*
