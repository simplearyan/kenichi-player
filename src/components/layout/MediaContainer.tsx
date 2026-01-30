import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import {
    DefaultAudioLayout,
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { RefObject } from "react";
import { MediaItem } from "../../types";
import { getMediaUrl } from "../../utils/file";
import { formatSize } from "../../utils/format";

interface MediaContainerProps {
    currentItem: MediaItem;
    playerRef: RefObject<MediaPlayerInstance | null>;
    filmstripVisible: boolean;
    onVideoEnd: () => void;
    setMetaInfo: (info: string) => void;
}

export default function MediaContainer({
    currentItem,
    playerRef,
    filmstripVisible,
    onVideoEnd,
    setMetaInfo
}: MediaContainerProps) {
    return (
        <div
            className="w-full h-full relative flex items-center justify-center bg-black transition-all duration-300"
            style={{
                paddingBottom: filmstripVisible ? '184px' : '64px',
                paddingTop: '48px'
            }}
        >
            {currentItem.type === 'video' ? (
                <MediaPlayer
                    ref={playerRef}
                    src={getMediaUrl(currentItem.path)}
                    viewType="video"
                    streamType="on-demand"
                    logLevel="warn"
                    crossOrigin
                    playsInline
                    title={currentItem.name}
                    className="w-full h-full object-contain ring-0 outline-none"
                    autoPlay
                    onEnd={onVideoEnd}
                    load="eager"
                    preload="auto"
                >
                    <MediaProvider />
                    <DefaultAudioLayout icons={defaultLayoutIcons} />
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
            ) : (
                <img
                    key={currentItem.path}
                    src={getMediaUrl(currentItem.path)}
                    alt={currentItem.name}
                    className="w-full h-full object-contain animate-fade-in"
                    onLoad={(e) => {
                        const img = e.currentTarget;
                        const res = `${img.naturalWidth} x ${img.naturalHeight}`;
                        const size = currentItem.size ? formatSize(currentItem.size) : '';
                        setMetaInfo(`${res} • ${size}`);
                    }}
                />
            )}
        </div>
    );
}
