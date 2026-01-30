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
    onToggleFullscreen: () => void;
}

import { SHORTCUTS } from "../config/shortcuts";

export function useMediaShortcuts({
    player,
    currentItem,
    currentIndex,
    playlistLength,
    setCurrentIndex,
    setFilmstripVisible,
    onToggleFullscreen
}: UseMediaShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const code = e.code;
            const isMedia = currentItem?.type === 'video' || currentItem?.type === 'audio';

            // Global Window Fullscreen (F11) - Works for ALL media types
            if (SHORTCUTS.WINDOW.TOGGLE_FULLSCREEN.includes(code)) {
                e.preventDefault();
                onToggleFullscreen();
                return;
            }

            // Player Controls (Video/Audio Only)
            if (isMedia && player.current) {
                // Defensive check: is media engine ready?
                // @ts-ignore
                const isReady = player.current.state?.canPlay;

                if (SHORTCUTS.PLAYER.TOGGLE_PLAY.includes(code)) {
                    e.preventDefault();
                    if (isReady) {
                        if (player.current.paused) player.current.play();
                        else player.current.pause();
                    }
                } else if (SHORTCUTS.PLAYER.TOGGLE_FULLSCREEN.includes(code)) {
                    e.preventDefault();
                    // Toggle PLAYER fullscreen, not window fullscreen
                    if (player.current.state.fullscreen) {
                        player.current.exitFullscreen();
                    } else {
                        player.current.enterFullscreen();
                    }
                } else if (SHORTCUTS.PLAYER.TOGGLE_MUTE.includes(code)) {
                    e.preventDefault();
                    player.current.muted = !player.current.muted;
                } else if (SHORTCUTS.PLAYER.SEEK_BACK.includes(code)) {
                    if (isReady) {
                        e.preventDefault();
                        player.current.currentTime = Math.max(0, player.current.currentTime - 5);
                    }
                } else if (SHORTCUTS.PLAYER.SEEK_FORWARD.includes(code)) {
                    if (isReady) {
                        e.preventDefault();
                        player.current.currentTime = Math.min(player.current.duration, player.current.currentTime + 5);
                    }
                }
            }

            // Navigation Controls
            // Allow navigation if NOT media, OR if media is not ready/playing (depending on focus, 
            // but here we just check if we didn't consume it as a seek)

            // Note: We need to be careful not to double-handle arrow keys if they were used for seeking.
            // Simplified logic: If it was a seek (isMedia && isReady), we already blocked default.
            // If we are here, we might need to navigate.

            // Actually, let's keep navigation simple:
            // Arrows navigate ONLY if NOT media, or if media is NOT ready.
            // If media IS ready, arrows seek.

            const isMediaReady = isMedia && player.current?.state?.canPlay;

            if (SHORTCUTS.NAVIGATION.PREV.includes(code)) {
                if (currentIndex > 0) setCurrentIndex(c => c - 1);
            } else if (SHORTCUTS.NAVIGATION.NEXT.includes(code)) {
                if (currentIndex < playlistLength - 1) setCurrentIndex(c => c + 1);
            } else if (SHORTCUTS.NAVIGATION.FILMSTRIP.includes(code)) {
                setFilmstripVisible(v => !v);
            } else if (code === 'ArrowLeft' && !isMediaReady) {
                if (currentIndex > 0) setCurrentIndex(c => c - 1);
            } else if (code === 'ArrowRight' && !isMediaReady) {
                if (currentIndex < playlistLength - 1) setCurrentIndex(c => c + 1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentItem, currentIndex, playlistLength]);
}
