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

function App() {
  const [src, setSrc] = useState<string | null>(null);

  const loadFile = (path: string) => {
    // Manually construct the URL for our custom protocol.
    // On Windows, strict 'media://' usually fails due to WebView2 quirks unless mapped to localhost.
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
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden" data-tauri-drag-region>
      {!src && (
        <div className="text-center space-y-6 p-10 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"> Kenichi Lite </h1>
          <p className="text-slate-400">Drag and drop a video here</p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>or</span>
          </div>
          <button
            onClick={handleOpen}
            className="px-6 py-2.5 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 cursor-pointer"
          >
            Open File
          </button>
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
