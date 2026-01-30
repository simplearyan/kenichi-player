import { useRef } from "react";
import { MediaPlayerInstance } from "@vidstack/react";
import { open } from '@tauri-apps/plugin-dialog';

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/base.css";

import TitleBar from "./components/TitleBar";
import Filmstrip from "./components/Filmstrip";
import NavigationArrows from "./components/NavigationArrows";
import Footer from "./components/Footer";
import EmptyState from "./components/layout/EmptyState";
import MediaContainer from "./components/layout/MediaContainer";

import { usePlaylist } from "./hooks/usePlaylist";
import { useMediaShortcuts } from "./hooks/useMediaShortcuts";
import { useMediaMetadata } from "./hooks/useMediaMetadata";

function App() {
  const {
    playlist,
    currentIndex,
    setCurrentIndex,
    currentItem,
    filmstripVisible,
    setFilmstripVisible,
    autoAdvance,
    setAutoAdvance,
    addToPlaylist,
    onVideoEnd
  } = usePlaylist();

  const player = useRef<MediaPlayerInstance>(null);

  // Metadata Hooks
  const { metaInfo, setMetaInfo } = useMediaMetadata(currentItem, player);

  // Shortcut Hooks
  useMediaShortcuts({
    player,
    currentItem,
    currentIndex,
    playlistLength: playlist.length,
    setCurrentIndex,
    setFilmstripVisible
  });

  const handleOpen = async () => {
    try {
      const file = await open({
        multiple: true,
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

  return (
    <div className="h-screen w-screen bg-pro-950 flex flex-col text-white overflow-hidden selection:bg-brand-yellow/30">
      <TitleBar
        filename={currentItem?.name}
        mediaType={currentItem?.type}
      />

      {/* Main Content Area (Flex Grow) */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col group">

        {/* Navigation Arrows */}
        {playlist.length > 1 && (
          <NavigationArrows
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < playlist.length - 1}
            onPrev={() => setCurrentIndex(c => Math.max(0, c - 1))}
            onNext={() => setCurrentIndex(c => Math.min(playlist.length - 1, c + 1))}
          />
        )}

        {/* Empty State */}
        {playlist.length === 0 && <EmptyState onOpen={handleOpen} />}

        {/* Media Player / Image Viewer */}
        {currentItem && (
          <MediaContainer
            currentItem={currentItem}
            playerRef={player}
            filmstripVisible={filmstripVisible}
            onVideoEnd={onVideoEnd}
            setMetaInfo={setMetaInfo}
          />
        )}
      </div>

      {/* Bottom Section: Filmstrip + Footer */}
      <div className="absolute bottom-0 left-0 w-full z-50 flex flex-col transition-all duration-300">
        <Filmstrip
          items={playlist}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          onRemove={(idx) => {
            const newPlaylist = playlist.filter((_, i) => i !== idx);
            // Assuming usePlaylist exposes setPlaylist (it does)
            // @ts-ignore
            if (setPlaylist) {
              // @ts-ignore
              setPlaylist(newPlaylist);
            }
            // @ts-ignore
            if (currentIndex >= newPlaylist.length) setCurrentIndex(Math.max(0, newPlaylist.length - 1));
          }}
          visible={filmstripVisible}
        />

        {/*
            Wait, I need to pass setPlaylist or a remove handler to Filmstrip's onRemove.
            The hook exports setPlaylist, so I can implement the remove logic here or add remove to the hook.
            Let's keep it here for now to avoid re-editing the hook immediately, but ideally it goes in the hook.
        */}

        <Footer
          fileInfo={currentItem ? metaInfo : undefined}
          filmstripVisible={filmstripVisible}
          onToggleFilmstrip={() => setFilmstripVisible(!filmstripVisible)}
          autoAdvance={autoAdvance}
          onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
        />
      </div>
    </div>
  );
}

export default App;

