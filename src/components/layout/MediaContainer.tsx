import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from "@vidstack/react";
import CustomVideoLayout from "../player/CustomVideoLayout";
import AudioVisualizer from "../player/AudioVisualizer";
import { RefObject, useState, useEffect, useRef } from "react";
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
    zoomLevel?: number;
    setZoomLevel?: React.Dispatch<React.SetStateAction<number>>;
}

export default function MediaContainer({
    currentItem,
    playerRef,
    filmstripVisible,
    onVideoEnd,
    setMetaInfo,
    autoHideControls,
    zoomLevel = 1,
    setZoomLevel = () => { }
}: MediaContainerProps) {
    const isAudio = currentItem.type === 'audio' || AUDIO_EXTS.some(ext => currentItem.path.toLowerCase().endsWith(ext));

    // Pan State
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const panStartRef = useRef({ x: 0, y: 0 });

    // Reset pan when zoom is reset
    useEffect(() => {
        if (zoomLevel === 1) {
            setPan({ x: 0, y: 0 });
        }
    }, [zoomLevel]);

    const handleWheel = (e: React.WheelEvent) => {
        if (currentItem.type === 'video' || isAudio) return;

        // Only consume event if Ctrl is pressed or if we are not at default zoom
        if (e.ctrlKey || zoomLevel !== 1) {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY) * 0.5;
            setZoomLevel((prev: number) => Math.min(Math.max(prev + delta, 0.1), 5));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            dragStartRef.current = { x: e.clientX, y: e.clientY };
            panStartRef.current = { x: pan.x, y: pan.y };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoomLevel > 1) {
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            setPan({
                x: panStartRef.current.x + dx,
                y: panStartRef.current.y + dy
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="w-full h-full relative flex items-center justify-center bg-transparent transition-all duration-300 overflow-hidden"
            style={{
                paddingBottom: filmstripVisible ? '132px' : '64px',
                paddingTop: '48px'
            }}
            onWheel={handleWheel}
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
                <div
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                >
                    <img
                        key={currentItem.path}
                        src={getMediaUrl(currentItem.path)}
                        alt={currentItem.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-75 ease-out select-none"
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`
                        }}
                        draggable={false}
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            const res = `${img.naturalWidth} x ${img.naturalHeight}`;
                            const size = currentItem.size ? formatSize(currentItem.size) : '';
                            setMetaInfo(`${res} • ${size}`);
                        }}
                        onDoubleClick={() => {
                            setZoomLevel(1);
                            setPan({ x: 0, y: 0 });
                        }}
                    />
                </div>
            )}
        </div>
    );
}
