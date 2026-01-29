import { useEffect, useState, useRef } from "react";
import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, stat } from "@tauri-apps/plugin-fs";
import { basename, extname } from "@tauri-apps/api/path"; // We might need to handle path parsing manually if these aren't available client-side easily, but usually they are.
// Actually, simple string manipulation is safer/faster for basic extension checks in webview.

import logo from "./assets/logo.png";
import TitleBar from "./components/TitleBar";
import Filmstrip, { MediaItem } from "./components/Filmstrip";
import { ChevronDown, ChevronUp } from "lucide-react";

// Helper to check extensions
const VIDEO_EXTS = ['.mp4', '.mkv', '.webm', '.mov', '.avi'];
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
const AUDIO_EXTS = ['.mp3', '.wav'];

function App() {
  const [playlist, setPlaylist] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filmstripVisible, setFilmstripVisible] = useState(true);

  const player = useRef<MediaPlayerInstance>(null);

  const currentItem = playlist[currentIndex];

  // Helper to create MediaItem
  const createMediaItem = (path: string): MediaItem | null => {
    const name = path.split(/[\\/]/).pop() || "Unknown";
    const ext = "." + name.split('.').pop()?.toLowerCase();

    let type: 'video' | 'image' | null = null;
    if (VIDEO_EXTS.includes(ext) || AUDIO_EXTS.includes(ext)) type = 'video';
    if (IMAGE_EXTS.includes(ext)) type = 'image';

    if (!type) return null;
    return { path, name, type };
  };

  const addToPlaylist = async (paths: string[]) => {
    const newItems: MediaItem[] = [];

    for (const path of paths) {
      try {
        const info = await stat(path);
        if (info.isDirectory) {
          const entries = await readDir(path);
          for (const entry of entries) {
            // entry.name is just the filename. We need full path.
            // This is tricky cross-platform without 'path.join'.
            // Assuming Windows for now based on user context, or simple concatenation.
            // To be robust, we assume the separator from the parent path.
            const sep = path.includes("\\") ? "\\" : "/";
            const fullPath = `${path}${sep}${entry.name}`;
            const item = createMediaItem(fullPath);
            if (item) newItems.push(item);
          }
        } else {
          const item = createMediaItem(path);
          if (item) newItems.push(item);
        }
      } catch (err) {
        console.error("Error processing path:", path, err);
      }
    }

    if (newItems.length > 0) {
      setPlaylist(prev => {
        // Avoid duplicates?
        const existing = new Set(prev.map(p => p.path));
        const unique = newItems.filter(i => !existing.has(i.path));
        return [...prev, ...unique];
      });
      // If we were empty, start playing the first new one
      if (playlist.length === 0) {
        setCurrentIndex(0);
      }
    }
  };

  const loadFile = (path: string) => {
    // Legacy support: treat single load as clearing playlist and adding one
    // Or just append? User likely wants to "Open" -> Play this.
    // Let's clear and add.
    const item = createMediaItem(path);
    if (item) {
      setPlaylist([item]);
      setCurrentIndex(0);
    }
  };

  // Protocol Handler
  const getMediaUrl = (path: string) => {
    const encodedPath = encodeURIComponent(path);
    return `http://media.localhost/${encodedPath}`;
  };

  useEffect(() => {
    const unlisten = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "drop") {
        addToPlaylist(event.payload.paths);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow some keys even if no media, but mostly we need media
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyF", "KeyM", "KeyK", "KeyN", "KeyP", "KeyT"].includes(e.code)) {
        // Don't prevent default always, inputs might need it, but we have no inputs.
      }

      switch (e.code) {
        case "Space":
        case "KeyK":
          if (currentItem?.type === 'video' && player.current) {
            e.preventDefault();
            if (player.current.paused) player.current.play();
            else player.current.pause();
          }
          break;
        case "KeyF":
          e.preventDefault();
          if (currentItem?.type === 'video' && player.current) {
            if (player.current.fullscreen) player.current.exitFullscreen();
            else player.current.enterFullscreen();
          }
          break;
        case "KeyM":
          if (currentItem?.type === 'video' && player.current) {
            e.preventDefault();
            player.current.muted = !player.current.muted;
          }
          break;
        case "ArrowLeft":
          if (currentItem?.type === 'video' && player.current) {
            e.preventDefault();
            player.current.currentTime = Math.max(0, player.current.currentTime - 5);
          } else {
            // If image, maybe prev?
            if (currentIndex > 0) setCurrentIndex(c => c - 1);
          }
          break;
        case "ArrowRight":
          if (currentItem?.type === 'video' && player.current) {
            e.preventDefault();
            player.current.currentTime = Math.min(player.current.duration, player.current.currentTime + 5);
          } else {
            // If image, maybe next?
            if (currentIndex < playlist.length - 1) setCurrentIndex(c => c + 1);
          }
          break;
        case "KeyN": // Next Track
          if (currentIndex < playlist.length - 1) setCurrentIndex(c => c + 1);
          break;
        case "KeyP": // Prev Track
          if (currentIndex > 0) setCurrentIndex(c => c - 1);
          break;

        case "KeyT": // Toggle Filmstrip
          setFilmstripVisible(v => !v);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unlisten.then((f) => f());
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playlist, currentIndex, currentItem]); // Re-bind when state changes to capture latest closure values if needed

  const handleOpen = async () => {
    try {
      const file = await open({
        multiple: true, // Allow multiple
        filters: [{
          name: 'Media',
          extensions: ['mp4', 'mkv', 'webm', 'mov', 'avi', 'mp3', 'wav', 'jpg', 'png', 'webp', 'gif']
        }]
      });

      if (file) {
        if (Array.isArray(file)) {
          addToPlaylist(file);
        } else {
          addToPlaylist([file]);
        }
      }
    } catch (err) {
      console.error("Failed to open file:", err);
    }
  };

  const onVideoEnd = () => {
    // Auto-advance
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(c => c + 1);
    }
  };

  return (
    <div className="h-screen w-screen bg-pro-950 flex flex-col items-center justify-center text-white overflow-hidden selection:bg-brand-yellow/30 pt-10">
      <TitleBar />

      {/* Empty State */}
      {playlist.length === 0 && (
        <div className="relative group flex flex-col items-center justify-center space-y-8 animate-fade-in">
          {/* Card Container */}
          <div className="w-[480px] bg-pro-900/50  border border-pro-800 rounded-3xl p-10 flex flex-col items-center ">
            <div className="mb-6 relative">
              <img src={logo} alt="Kenichi Lite Logo" className="w-24 h-24 " />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-br from-brand-yellow to-brand-orange bg-clip-text text-transparent">Kenichi</span>{" "}
              <span className="text-white">Lite</span>
            </h1>
            <p className="text-pro-400 text-sm mb-8 text-center leading-relaxed">
              High-performance media playback.<br />
              Drag and drop folders or files.
            </p>
            <div className="w-full flex flex-col items-center gap-4">
              <button
                onClick={handleOpen}
                className="group relative w-full py-3.5 px-6 rounded-xl font-bold text-pro-950 bg-gradient-to-r from-brand-yellow to-brand-orange hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                  Open Media
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
              </button>
            </div>
          </div>
          <div className="text-xs text-pro-800 font-mono mt-8">v0.1.0 • rust • wgpu</div>
        </div>
      )}

      {/* Media Player / Image Viewer */}
      {currentItem && (
        <div className="w-full h-full relative flex items-center justify-center bg-black">
          {currentItem.type === 'video' ? (
            <MediaPlayer
              ref={player}
              src={getMediaUrl(currentItem.path)}
              viewType="video"
              streamType="on-demand"
              logLevel="warn"
              crossOrigin
              playsInline
              title={currentItem.name}
              className="w-full h-full object-contain ring-0 outline-none"
              autoPlay
              onEnd={onVideoEnd}
              key={currentItem.path} // Force re-mount on change usually good for clean state, or rely on src change
            >
              <MediaProvider />
              <DefaultAudioLayout icons={defaultLayoutIcons} />
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
          ) : (
            <img
              src={getMediaUrl(currentItem.path)}
              alt={currentItem.name}
              className="w-full h-full object-contain animate-fade-in"
            />
          )}
        </div>
      )}

      {/* Filmstrip */}
      {playlist.length > 0 && (
        <>
          <Filmstrip
            items={playlist}
            currentIndex={currentIndex}
            onSelect={setCurrentIndex}
            onRemove={(idx) => {
              const newPlaylist = playlist.filter((_, i) => i !== idx);
              setPlaylist(newPlaylist);
              if (currentIndex >= newPlaylist.length) setCurrentIndex(Math.max(0, newPlaylist.length - 1));
            }}
            visible={filmstripVisible}
          />
          {/* Toggle Button */}
          <button
            onClick={() => setFilmstripVisible(v => !v)}
            className="fixed bottom-2 right-2 p-2 bg-pro-900/50 hover:bg-pro-800 text-pro-400 rounded-lg hover:text-white transition-colors z-50 focus:outline-none"
            title="Toggle Filmstrip (T)"
          >
            {filmstripVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
