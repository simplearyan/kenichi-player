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
            const isMedia = currentItem?.type === 'video' || currentItem?.type === 'audio';

            // Player Controls
            if (isMedia && player.current) {
                // Defensive check: is media engine ready?
                // @ts-ignore
                const isReady = player.current.state?.canPlay;

                switch (code) {
                    case "Space":
                    case "KeyK":
                        e.preventDefault();
                        if (isReady) {
                            if (player.current.paused) player.current.play();
                            else player.current.pause();
                        }
                        break;
                    case "KeyF":
                        if (currentItem?.type === 'video') {
                            e.preventDefault();
                            // @ts-ignore
                            if (player.current.fullscreen) player.current.exitFullscreen();
                            else player.current.enterFullscreen();
                        }
                        break;
                    case "KeyM":
                        e.preventDefault();
                        player.current.muted = !player.current.muted;
                        break;
                    case "ArrowLeft":
                        if (isReady) {
                            e.preventDefault();
                            player.current.currentTime = Math.max(0, player.current.currentTime - 5);
                        }
                        break;
                    case "ArrowRight":
                        if (isReady) {
                            e.preventDefault();
                            player.current.currentTime = Math.min(player.current.duration, player.current.currentTime + 5);
                        }
                        break;
                }
            }

            // Navigation Controls
            switch (code) {
                case "ArrowLeft":
                    // If media not ready or not seeking, allow playlist navigation
                    if (!isMedia || (player.current && !player.current.state?.canPlay)) {
                        if (currentIndex > 0) setCurrentIndex(c => c - 1);
                    }
                    break;
                case "ArrowRight":
                    if (!isMedia || (player.current && !player.current.state?.canPlay)) {
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
