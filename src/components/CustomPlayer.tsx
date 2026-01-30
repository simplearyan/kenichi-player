import {
    MediaPlayer,
    MediaProvider,
    Controls,
    PlayButton,
    MuteButton,
    TimeSlider,
    VolumeSlider,
    Time,
    useMediaState,
    type MediaPlayerInstance,
} from "@vidstack/react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
} from "lucide-react";
import React from "react";

interface CustomPlayerProps {
    playerRef: React.RefObject<MediaPlayerInstance | null>;
    src: string;
    title: string;
    onEnd?: () => void;
    filmstripVisible: boolean;
}

export default function CustomPlayer({ playerRef, src, title, onEnd, filmstripVisible }: CustomPlayerProps) {
    const isPaused = useMediaState('paused', playerRef);
    const isMuted = useMediaState('muted', playerRef);
    const bottomOffset = filmstripVisible ? 184 : 64;
    return (
        <MediaPlayer
            ref={playerRef}
            src={src}
            viewType="video"
            streamType="on-demand"
            logLevel="warn"
            crossOrigin
            playsInline
            title={title}
            className="w-full h-full object-contain ring-0 outline-none select-none"
            autoPlay
            onEnd={onEnd}
            load="eager"
            preload="auto"
        >
            <MediaProvider />

            {/* Custom UI Layer Overlay */}
            <Controls.Root className="absolute inset-0 z-10 flex flex-col justify-end opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">

                {/* Top/Middle Area - Could add BIG Play button here on hover */}
                <div className="flex-1 flex items-center justify-center pointer-events-auto">
                    {/* Big play button could go here or we rely on the bottom bar */}
                </div>

                {/* Bottom Control Bar */}
                <div
                    className="w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-auto transition-all duration-300"
                    style={{ paddingBottom: `${bottomOffset + 24}px` }}
                >
                    {/* Progress Slider */}
                    <div className="group mb-4">
                        <TimeSlider.Root className="w-full relative flex items-center h-6 cursor-pointer outline-none">
                            <TimeSlider.Track className="relative w-full h-1 bg-white/10 rounded-full group-hover:h-1.5 transition-all">
                                {/* Buffering Progress (Behind) */}
                                <TimeSlider.Progress className="absolute h-full rounded-full z-0" />
                                {/* Playback Fill (In front) */}
                                <TimeSlider.TrackFill className="absolute h-full rounded-full z-10" />
                            </TimeSlider.Track>
                            <TimeSlider.Thumb className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-black/50 z-20" />
                        </TimeSlider.Root>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        {/* Left Side Controls */}
                        <div className="flex items-center gap-3">
                            <PlayButton className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                {isPaused ? <Play className="fill-white w-5 h-5 pointer-events-none" /> : <Pause className="fill-white w-5 h-5 pointer-events-none" />}
                            </PlayButton>

                            <div className="flex items-center gap-1 text-xs font-mono text-white/80 tabular-nums">
                                <Time type="current" />
                                <span className="text-white/30">/</span>
                                <Time type="duration" />
                            </div>
                        </div>

                        {/* Right Side Controls */}
                        <div className="flex items-center gap-4">
                            {/* Volume */}
                            <div className="flex items-center gap-2 group/volume relative">
                                <MuteButton className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
                                    {isMuted ? <VolumeX className="w-5 h-5 pointer-events-none" /> : <Volume2 className="w-5 h-5 pointer-events-none" />}
                                </MuteButton>

                                <VolumeSlider.Root className="w-0 group-hover/volume:w-24 transition-all duration-300 relative flex items-center h-6 cursor-pointer overflow-hidden">
                                    <VolumeSlider.Track className="relative w-full h-1 bg-white/10 rounded-full">
                                        <VolumeSlider.TrackFill className="absolute h-full rounded-full" />
                                    </VolumeSlider.Track>
                                    <VolumeSlider.Thumb className="absolute w-3 h-3 bg-white rounded-full shadow-md shadow-black/30" />
                                </VolumeSlider.Root>
                            </div>

                            {/* Fullscreen handled by standard shortcut, but adding button is nice */}
                            {/* We don't have exit/enter icons easily toggleable here without media states, 
                   but Vidstack handles it via media-pseudo classes */}
                        </div>
                    </div>
                </div>
            </Controls.Root>
        </MediaPlayer>
    );
}
