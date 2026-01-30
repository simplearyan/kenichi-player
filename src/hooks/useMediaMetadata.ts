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
        }

        // 3. Video Handling via Vidstack Store Subscription
        let unsubscribe: (() => void) | undefined;

        if (currentItem?.type === 'video' && player) {
            setTimeout(() => {
                if (player.current) {
                    unsubscribe = player.current.subscribe(({ videoWidth, videoHeight, duration }) => {
                        const parts: string[] = [];
                        if (videoWidth && videoHeight) parts.push(`${videoWidth} x ${videoHeight}`);
                        if (sizeStr) parts.push(sizeStr);
                        if (duration > 0) parts.push(formatTime(duration));

                        setMetaInfo(prev => {
                            const newValue = parts.join(" • ");
                            return prev === newValue ? prev : newValue;
                        });
                    });
                }
            }, 50);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentItem]);

    return { metaInfo, setMetaInfo };
}
