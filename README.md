# Kenichi Lite 🎬

**A minimalist, lightweight media player built for the "Potato PC" era.**

Kenichi Lite is a high-performance video player that mimics the simplicity of VLC but with a modern, dark aesthetic. It leverages the power of **Tauri v2** and **Rust** to deliver smooth playback without the bloat of web browsers or heavy Electron apps.

## ⚡ Features

-   **🚀 Lightweight**: Built on Tauri v2 (uses native WebView). small binary size, low RAM usage.
-   **🎨 Modern UI**: Clean, dark "Pro" theme inspired by modern creative tools.
-   **📼 Format Support**: Plays standard web-friendly formats (MP4, WebM, MP3, WAV).
-   **⚡ Streaming Protocol**: Custom Rust `media://` protocol for efficient file streaming and seeking.
-   **🖱️ Drag & Drop**: Native OS file drag and drop support.
-   **⌨️ Vidstack Player**: Robust playback controls (Volume, Fullscreen, Seeking, Shortcuts) powered by Vidstack.

## 🛠️ Tech Stack

-   **Core**: [Tauri v2](https://v2.tauri.app/) (Rust + WebView2)
-   **Frontend**: React 19 + TypeScript + Vite
-   **Styling**: TailwindCSS v4
-   **Player Lib**: [Vidstack](https://vidstack.io/)
-   **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

-   [Rust](https://www.rust-lang.org/tools/install) (latest stable)
-   [Node.js](https://nodejs.org/) (v20+)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/simplearyan/KenichiLite.git
    cd KenichiLite
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run in development mode:
    ```bash
    npm run tauri dev
    ```

4.  Build for production:
    ```bash
    npm run tauri build
    ```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT License.
