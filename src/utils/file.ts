import { MediaItem } from "../types";

export const VIDEO_EXTS = ['.mp4', '.mkv', '.webm', '.mov', '.avi'];
export const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
export const AUDIO_EXTS = ['.mp3', '.wav'];

export const getMediaUrl = (path: string) => {
    const encodedPath = encodeURIComponent(path);
    return `http://media.localhost/${encodedPath}`;
};

export const getMediaType = (filename: string): 'video' | 'image' | 'audio' | null => {
    const ext = "." + filename.split('.').pop()?.toLowerCase();
    if (VIDEO_EXTS.includes(ext)) return 'video';
    if (AUDIO_EXTS.includes(ext)) return 'audio';
    if (IMAGE_EXTS.includes(ext)) return 'image';
    return null;
};

export const createMediaItem = (path: string, size?: number): MediaItem | null => {
    const name = path.split(/[\\/]/).pop() || "Unknown";
    const type = getMediaType(name);

    if (!type) return null;
    return { path, name, type, size };
};
