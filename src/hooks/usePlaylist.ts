import { useState, useEffect } from "react";
import { readDir, stat } from "@tauri-apps/plugin-fs";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { MediaItem } from "../types";
import { createMediaItem } from "../utils/file";

export function usePlaylist() {
    const [playlist, setPlaylist] = useState<MediaItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filmstripVisible, setFilmstripVisible] = useState(true);
    const [autoAdvance, setAutoAdvance] = useState(true);

    const currentItem = playlist[currentIndex];

    const addToPlaylist = async (paths: string[]) => {
        const newItems: MediaItem[] = [];

        for (const path of paths) {
            try {
                const info = await stat(path);
                if (info.isDirectory) {
                    const entries = await readDir(path);
                    for (const entry of entries) {
                        const sep = path.includes("\\") ? "\\" : "/";
                        const fullPath = `${path}${sep}${entry.name}`;
                        try {
                            const fileInfo = await stat(fullPath);
                            if (!fileInfo.isDirectory) {
                                const item = createMediaItem(fullPath, fileInfo.size);
                                if (item) newItems.push(item);
                            }
                        } catch (e) { console.warn("Skipping file", fullPath, e) }
                    }
                } else {
                    const item = createMediaItem(path, info.size);
                    if (item) newItems.push(item);
                }
            } catch (err) {
                console.error("Error processing path:", path, err);
            }
        }

        if (newItems.length > 0) {
            setPlaylist(prev => {
                const existing = new Set(prev.map(p => p.path));
                const unique = newItems.filter(i => !existing.has(i.path));
                return [...prev, ...unique];
            });
            if (playlist.length === 0) {
                setCurrentIndex(0);
            }
        }
    };

    // Listen for Drag and Drop
    useEffect(() => {
        const unlisten = getCurrentWebview().onDragDropEvent((event) => {
            if (event.payload.type === "drop") {
                addToPlaylist(event.payload.paths);
            }
        });
        return () => {
            unlisten.then((f) => f());
        };
    }, []); // Only run once on mount

    const onVideoEnd = () => {
        if (autoAdvance && currentIndex < playlist.length - 1) {
            setCurrentIndex(c => c + 1);
        }
    };

    return {
        playlist,
        setPlaylist,
        currentIndex,
        setCurrentIndex,
        currentItem,
        filmstripVisible,
        setFilmstripVisible,
        autoAdvance,
        setAutoAdvance,
        addToPlaylist,
        onVideoEnd
    };
}
