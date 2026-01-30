import { useState, useEffect, RefObject } from "react";
import { MediaPlayerInstance } from "@vidstack/react";
import { MediaItem } from "../types";
import { formatSize, formatTime } from "../utils/format";
import { getMediaUrl } from "../utils/file";

export function useMediaMetadata(currentItem?: MediaItem, player?: RefObject<MediaPlayerInstance | null>) {
    const [metaInfo, setMetaInfo] = useState("");

    useEffect(() => {
        // 1. Initial Reset / Size only
        const sizeStr = formatSize(currentItem?.size);
        setMetaInfo(sizeStr || "");

        // 2. Image Handling
        if (currentItem?.type === 'image') {
            const img = new Image();
            img.onload = () => {
                const parts = [`${img.width} x ${img.height}`];
                if (sizeStr) parts.push(sizeStr);
                setMetaInfo(parts.join(" • "));
            };
            img.src = getMediaUrl(currentItem.path);
            return;
        }

        // 3. Media (Video/Audio) Handling via Vidstack Store Subscription
        let unsubscribe: (() => void) | undefined;
        const isMedia = currentItem?.type === 'video' || currentItem?.type === 'audio';

        if (isMedia && player?.current) {
            // Subscribe safely to player state
            try {
                unsubscribe = player.current.subscribe(({ videoWidth, videoHeight, duration }) => {
                    const parts: string[] = [];
                    // Only show resolution if it exists (usually video)
                    if (videoWidth && videoHeight && videoWidth > 0) {
                        parts.push(`${videoWidth} x ${videoHeight}`);
                    }
                    if (sizeStr) parts.push(sizeStr);
                    if (duration > 0) parts.push(formatTime(duration));

                    const newValue = parts.join(" • ");
                    setMetaInfo(prev => prev === newValue ? prev : newValue);
                });
            } catch (err) {
                console.warn("Failed to subscribe to player metadata:", err);
            }
        }

        return () => {
            if (unsubscribe) {
                try {
                    unsubscribe();
                } catch (e) {
                    // Ignore errors during cleanup as player might already be disposed
                }
            }
        };
    }, [currentItem, player?.current]);

    return { metaInfo, setMetaInfo };
}
