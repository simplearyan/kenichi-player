export interface MediaItem {
    path: string;
    name: string;
    type: 'video' | 'image' | 'audio';
    size?: number;
    thumbnail?: string;
}
