import { Film, LayoutGrid, Heart, Info, ZoomIn, ZoomOut, Eye, EyeOff } from "lucide-react";
import Tooltip from "./ui/Tooltip";

interface FooterProps {
    fileInfo?: string;
    filmstripVisible: boolean;
    onToggleFilmstrip: () => void;
    autoAdvance: boolean;
    onToggleAutoAdvance: () => void;
    autoHideControls: boolean;
    onToggleAutoHide: () => void;
}

export default function Footer({
    fileInfo,
    filmstripVisible,
    onToggleFilmstrip,
    autoAdvance,
    onToggleAutoAdvance,
    autoHideControls,
    onToggleAutoHide
}: FooterProps) {
    return (
        <div className="h-14 mb-2 mx-auto w-fit rounded-xl border border-white/5 bg-zinc-900/80 backdrop-blur-xl flex items-center gap-1 px-2 select-none z-50 transition-all duration-300 shadow-2xl">
            {/* Left Section: Quick Actions */}
            <div className="flex items-center gap-1">
                <Tooltip content="Filmstrip" shortcut="T">
                    <button
                        onClick={onToggleFilmstrip}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 ${filmstripVisible
                            ? "bg-white/10 text-white shadow-inner"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                </Tooltip>

                <Tooltip content="Auto-Advance">
                    <button
                        onClick={onToggleAutoAdvance}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 ${autoAdvance
                            ? "bg-white/10 text-brand-orange shadow-inner"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Film size={18} />
                    </button>
                </Tooltip>

                <Tooltip content="Hide Controls" shortcut="H">
                    <button
                        onClick={onToggleAutoHide}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 ${autoHideControls
                            ? "bg-white/10 text-brand-yellow shadow-inner"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {autoHideControls ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </Tooltip>

                <div className="w-px h-5 bg-white/10 mx-1"></div>

                <Tooltip content="Add to Favorites">
                    <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-95">
                        <Heart size={18} />
                    </button>
                </Tooltip>
            </div>

            {/* Metadata / Info Badge */}
            {fileInfo && (
                <>
                    <div className="w-px h-5 bg-white/10 mx-1"></div>
                    <div className="flex items-center px-3 h-8 rounded-md bg-black/20 border border-white/5 text-[11px] font-mono text-zinc-400 select-all">
                        {fileInfo}
                    </div>
                </>
            )}

            {/* Right Section: View Controls */}
            <div className="flex items-center gap-1">
                <div className="w-px h-5 bg-white/10 mx-1"></div>

                <div className="flex items-center gap-0.5">
                    <Tooltip content="Zoom Out" shortcut="-">
                        <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-95">
                            <ZoomOut size={16} />
                        </button>
                    </Tooltip>

                    <div className="w-16 h-1 bg-white/10 rounded-full relative mx-1">
                        <div className="absolute left-1/2 top-0 bottom-0 w-2 h-full bg-white rounded-full -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    </div>

                    <Tooltip content="Zoom In" shortcut="+">
                        <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-95">
                            <ZoomIn size={16} />
                        </button>
                    </Tooltip>
                </div>

                <Tooltip content="File Info" shortcut="I">
                    <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-95">
                        <Info size={18} />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}
