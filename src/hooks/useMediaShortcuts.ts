import { useEffect, RefObject } from "react";
import { MediaPlayerInstance } from "@vidstack/react";
import { MediaItem } from "../types";

interface UseMediaShortcutsProps {
    player: RefObject<MediaPlayerInstance | null>;
    currentItem?: MediaItem;
    currentIndex: number;
    playlistLength: number;
    setCurrentIndex: (index: number | ((prev: number) => number)) => void;
    setFilmstripVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
}

export function useMediaShortcuts({
    player,
    currentItem,
    currentIndex,
    playlistLength,
    setCurrentIndex,
    setFilmstripVisible
}: UseMediaShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const code = e.code;

            // Player Controls
            if (currentItem?.type === 'video' && player.current) {
                switch (code) {
                    case "Space":
                    case "KeyK":
                        e.preventDefault();
                        if (player.current.paused) player.current.play();
                        else player.current.pause();
                        break;
                    case "KeyF":
                        e.preventDefault();
                        // @ts-ignore
                        if (player.current.fullscreen) player.current.exitFullscreen();
                        else player.current.enterFullscreen();
                        break;
                    case "KeyM":
                        e.preventDefault();
                        player.current.muted = !player.current.muted;
                        break;
                    case "ArrowLeft":
                        e.preventDefault();
                        player.current.currentTime = Math.max(0, player.current.currentTime - 5);
                        break;
                    case "ArrowRight":
                        e.preventDefault();
                        player.current.currentTime = Math.min(player.current.duration, player.current.currentTime + 5);
                        break;
                }
            }

            // Navigation Controls (Global override if not video specific handling above)
            switch (code) {
                case "ArrowLeft":
                    if (currentItem?.type !== 'video') {
                        if (currentIndex > 0) setCurrentIndex(c => c - 1);
                    }
                    break;
                case "ArrowRight":
                    if (currentItem?.type !== 'video') {
                        if (currentIndex < playlistLength - 1) setCurrentIndex(c => c + 1);
                    }
                    break;
                case "KeyN":
                case "PageDown":
                    if (currentIndex < playlistLength - 1) setCurrentIndex(c => c + 1);
                    break;
                case "KeyP":
                case "PageUp":
                    if (currentIndex > 0) setCurrentIndex(c => c - 1);
                    break;
                case "KeyT":
                    setFilmstripVisible(v => !v);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentItem, currentIndex, playlistLength]);
}
