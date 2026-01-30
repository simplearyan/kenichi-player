export interface MediaItem {
    path: string;
    name: string;
    type: 'video' | 'image';
    size?: number;
}
