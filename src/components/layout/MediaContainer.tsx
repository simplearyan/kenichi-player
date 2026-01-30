import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import CustomVideoLayout from "../player/CustomVideoLayout";
import AudioVisualizer from "../player/AudioVisualizer";
import { RefObject } from "react";
import { MediaItem } from "../../types";
import { getMediaUrl, AUDIO_EXTS } from "../../utils/file";
import { formatSize } from "../../utils/format";

interface MediaContainerProps {
    currentItem: MediaItem;
    playerRef: RefObject<MediaPlayerInstance | null>;
    filmstripVisible: boolean;
    onVideoEnd: () => void;
    setMetaInfo: (info: string) => void;
    autoHideControls: boolean;
}

export default function MediaContainer({
    currentItem,
    playerRef,
    filmstripVisible,
    onVideoEnd,
    setMetaInfo,
    autoHideControls
}: MediaContainerProps) {
    const isAudio = currentItem.type === 'audio' || AUDIO_EXTS.some(ext => currentItem.path.toLowerCase().endsWith(ext));

    return (
        <div
            className="w-full h-full relative flex items-center justify-center bg-transparent transition-all duration-300"
            style={{
                paddingBottom: filmstripVisible ? '132px' : '64px',
                paddingTop: '48px'
            }}
        >
            {currentItem.type === 'video' || isAudio ? (
                <MediaPlayer
                    key={currentItem.path}
                    ref={playerRef}
                    src={getMediaUrl(currentItem.path)}
                    viewType={isAudio ? 'audio' : 'video'}
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
                    {isAudio && <AudioVisualizer />}
                    <CustomVideoLayout autoHideControls={autoHideControls} />
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
