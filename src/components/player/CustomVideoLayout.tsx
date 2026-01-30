import {
    Controls,
    Gesture,
    PlayButton,
    MuteButton,
    FullscreenButton,
    TimeSlider,
    VolumeSlider,
    Time,
    useMediaState,
} from "@vidstack/react";
import {
    PlayIcon,
    PauseIcon,
    Volume2Icon,
    VolumeXIcon,
    MaximizeIcon,
    MinimizeIcon,
} from "lucide-react";

export default function CustomVideoLayout({ autoHideControls }: { autoHideControls: boolean }) {
    const isPaused = useMediaState("paused");
    const isMuted = useMediaState("muted");
    const isFullscreen = useMediaState("fullscreen");
    const isBuffering = useMediaState("waiting");

    return (
        <>
            <Gesture
                className="absolute inset-0 z-0 block h-full w-full"
                event="pointerup"
                action="toggle:paused"
            />
            <Gesture
                className="absolute inset-0 z-0 block h-full w-full"
                event="dblpointerup"
                action="toggle:fullscreen"
            />

            <Controls.Root className="absolute inset-0 z-10 flex h-full w-full flex-col justify-end pointer-events-none">

                {/* Custom Loading Spinner (Subtle) */}
                {isBuffering && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] animate-in fade-in duration-200">
                        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/80 animate-spin"></div>
                    </div>
                )}

                {/* Floating Control Bar */}
                <Controls.Group className={`pointer-events-auto mx-auto mb-8 flex w-fit items-center gap-4 rounded-full bg-zinc-900/85 backdrop-blur-xl px-6 py-3 shadow-2xl transition-all duration-300 hover:bg-zinc-900/95 border border-white/10 ${autoHideControls ? 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0' : 'opacity-100'
                    }`}>

                    {/* Play/Pause */}
                    <PlayButton className="group ring-media-focus relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/20 transition-colors">
                        {isPaused ? (
                            <PlayIcon className="h-5 w-5 fill-white text-white translate-x-px" />
                        ) : (
                            <PauseIcon className="h-5 w-5 fill-white text-white" />
                        )}
                    </PlayButton>

                    {/* Time Display */}
                    <div className="flex items-center gap-1 text-xs font-medium text-white/90 font-mono">
                        <Time type="current" />
                        <span className="text-white/50">/</span>
                        <Time type="duration" />
                    </div>

                    {/* Scrubber (Small, compact) */}
                    <TimeSlider.Root className="group relative mx-2 inline-flex h-6 w-48 cursor-pointer items-center outline-none">
                        <TimeSlider.Track className="relative h-1.5 w-full rounded-full bg-white/20 group-hover:h-2 transition-all">
                            <TimeSlider.TrackFill className="absolute h-full w-(--chapter-fill) rounded-full bg-brand-yellow/50" />
                            <TimeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-full bg-brand-yellow will-change-[width]" />
                            <TimeSlider.Progress className="absolute h-full w-(--slider-progress) rounded-full bg-white/50" />
                        </TimeSlider.Track>
                        <TimeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity group-hover:opacity-100 will-change-[left]" />
                    </TimeSlider.Root>

                    {/* Volume */}
                    <div className="flex items-center gap-2 group/vol">
                        <MuteButton className="group ring-media-focus relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/20 transition-colors">
                            {isMuted ? (
                                <VolumeXIcon className="h-4 w-4 text-white" />
                            ) : (
                                <Volume2Icon className="h-4 w-4 text-white" />
                            )}
                        </MuteButton>
                        <VolumeSlider.Root className="relative mx-0 inline-flex h-1.5 w-0 origin-left cursor-pointer items-center outline-none transition-[width] duration-200 group-hover/vol:w-20 group-hover/vol:mx-1">
                            <VolumeSlider.Track className="relative h-1.5 w-full rounded-full bg-white/20">
                                <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-full bg-white will-change-[width]" />
                            </VolumeSlider.Track>
                            <VolumeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover/vol:opacity-100 will-change-[left]" />
                        </VolumeSlider.Root>
                    </div>

                    {/* Fullscreen */}
                    <FullscreenButton className="group ring-media-focus relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-white/20 transition-colors">
                        {isFullscreen ? (
                            <MinimizeIcon className="h-4 w-4 text-white" />
                        ) : (
                            <MaximizeIcon className="h-4 w-4 text-white" />
                        )}
                    </FullscreenButton>

                </Controls.Group>
            </Controls.Root>
        </>
    );
}
