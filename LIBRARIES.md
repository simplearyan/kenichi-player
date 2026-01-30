# Recommended Open Source Libraries 📚

This document lists the recommended open-source libraries for **Kenichi Lite**, categorized by their role in the current project and future video editor development.

## 1. Image Editing & Canvas (Phase 4)
For adding cropping, drawing, and text overlays to photos and video snapshots.

- **[Fabric.js](http://fabricjs.com/)**: High-level library for working with HTML5 Canvas. Excellent for object-oriented drawing, text manipulation, and grouping.
- **[Konva.js](https://konvajs.org/)**: A 2D canvas library that feels like working with React components. Great for performance-heavy interactive drawing.
- **[react-easy-crop](https://github.com/valentinhuber/react-easy-crop)**: A lightweight, accessible React component for cropping images/videos with a beautiful UI.
- **[Lucide React](https://lucide.dev/)**: (Already using) Keep using this for consistent, lightweight, and customizable icons.

## 2. Video Editing & Processing (Rust Backend)
For deep integration with FFmpeg and performance-critical operations.

- **[ffmpeg-next](https://github.com/zmwangx/rust-ffmpeg-next)**: High-level Rust bindings for the FFmpeg C API. Essential for frame-accurate seeking and advanced encoding inside Tauri.
- **[Symphonia](https://github.com/pdeljanov/Symphonia)**: A pure Rust media decoding library. Extremely lightweight and fast for audio-only processing without the overhead of FFmpeg.
- **[Tauri Plugin Shell](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/shell)**: Necessary for running FFmpeg as a **Sidecar** (bundled binary) from your Rust core.

## 3. High-Performance Graphics (WGPU)
For the future 4K video editor engine.

- **[wgpu](https://wgpu.rs/)**: The industry standard for cross-platform, safe, and powerful GPU programming in Rust. This will be the "Engine" of your future editor.
- **[Nannou](https://nannou.cc/)**: A creative coding framework for Rust that uses WGPU. Great for building audio visualizers or complex video effects.
- **[egui](https://github.com/emilk/egui)**: An easy-to-use, immediate mode Rust UI library. If you ever build a specialized rendering window that doesn't use the browser, `egui` is the fastest way to add controls.

## 4. UI/UX & State Management
To keep the "Lite" app performant and responsive.

- **[Zustand](https://github.com/pmndrs/zustand)**: A small, fast, and scalable state-management solution. Perfect for managing playlist state, user settings, and editor history.
- **[Framer Motion](https://www.framer.com/motion/)**: The gold standard for React animations. Use this for the "smooth flow" when opening the media panel or switching items.
- **[TanStack Query](https://tanstack.com/query/latest)**: Excellent for managing "Asynchronous" data (like loading file lists or generating thumbnails) and caching them.

## 5. Metadata & Utilities
- **[ExifReader](https://github.com/mattiasw/ExifReader)**: A small library to extract GPS, camera info, and date metadata from photos locally.
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)**: Essential utilities for managing dynamic Tailwind classes without conflicts.

---
*Last Updated: January 29, 2026*
