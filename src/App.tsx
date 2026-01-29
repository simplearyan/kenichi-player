import { useEffect, useState } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
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
import logo from "./assets/logo.png";
import TitleBar from "./components/TitleBar";

function App() {
  const [src, setSrc] = useState<string | null>(null);

  const loadFile = (path: string) => {
    // Custom Protocol 'media' -> 'http://media.localhost/path/to/file'
    const encodedPath = encodeURIComponent(path);
    setSrc(`http://media.localhost/${encodedPath}`);
  };

  useEffect(() => {
    const unlisten = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "drop") {
        const file = event.payload.paths[0];
        loadFile(file);
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleOpen = async () => {
    try {
      const file = await open({
        multiple: false,
        filters: [{
          name: 'Media',
          extensions: ['mp4', 'mkv', 'webm', 'mov', 'avi', 'mp3', 'wav']
        }]
      });

      if (file) {
        loadFile(file as string);
      }
    } catch (err) {
      console.error("Failed to open file:", err);
    }
  };

  return (
    // Main Container with Pro Gray Background
    <div className="h-screen w-screen bg-pro-950 flex flex-col items-center justify-center text-white overflow-hidden selection:bg-brand-yellow/30 pt-10">
      <TitleBar />
      {!src && (
        <div className="relative group flex flex-col items-center justify-center space-y-8 animate-fade-in">

          {/* Subtle Glow Behind */}


          {/* Card Container */}
          <div className="w-[480px] bg-pro-900/50  border border-pro-800 rounded-3xl p-10 flex flex-col items-center ">

            {/* Logo Section */}
            <div className="mb-6 relative">
              <img src={logo} alt="Kenichi Lite Logo" className="w-24 h-24 " />
            </div>

            {/* Typography */}
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-br from-brand-yellow to-brand-orange bg-clip-text text-transparent">
                Kenichi
              </span>{" "}
              <span className="text-white">Lite</span>
            </h1>
            <p className="text-pro-400 text-sm mb-8 text-center leading-relaxed">
              High-performance media playback.<br />
              Drag and drop a file to begin.
            </p>

            {/* Action Area */}
            <div className="w-full flex flex-col items-center gap-4">
              <button
                onClick={handleOpen}
                className="group relative w-full py-3.5 px-6 rounded-xl font-bold text-pro-950 bg-gradient-to-r from-brand-yellow to-brand-orange hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                  Open Media File
                </span>
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
              </button>
            </div>

          </div>

          {/* Footer / Version */}
          <div className="text-xs text-pro-800 font-mono mt-8">
            v0.1.0 • rust • wgpu
          </div>

        </div>
      )}

      {src && (
        <MediaPlayer
          src={src}
          viewType="video"
          streamType="on-demand"
          logLevel="warn"
          crossOrigin
          playsInline
          title="Kenichi Player"
          className="w-full h-full object-contain bg-black ring-0 outline-none"
          autoPlay
        >
          <MediaProvider />
          <DefaultAudioLayout icons={defaultLayoutIcons} />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      )}
    </div>
  );
}

export default App;
