import { Film, LayoutGrid, Heart, Info, ZoomIn, ZoomOut } from "lucide-react";

interface FooterProps {
    fileInfo?: string;
    filmstripVisible: boolean;
    onToggleFilmstrip: () => void;
    autoAdvance: boolean;
    onToggleAutoAdvance: () => void;
}

export default function Footer({ fileInfo, filmstripVisible, onToggleFilmstrip, autoAdvance, onToggleAutoAdvance }: FooterProps) {
    return (
        <div className="h-16 bg-pro-950/80 backdrop-blur-md flex items-center justify-between px-6 select-none z-50 transition-all duration-300  w-full">
            {/* Left Section: Quick Actions */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-pro-800/50 rounded-lg p-1 gap-1 border border-white/5">
                    <button
                        onClick={onToggleFilmstrip}
                        className={`p-2 rounded-md transition-colors ${filmstripVisible
                            ? "bg-white/10 text-brand-yellow shadow-sm"
                            : "text-pro-400 hover:text-white hover:bg-white/5"
                            }`}
                        title={filmstripVisible ? "Hide Filmstrip" : "Show Filmstrip"}
                    >
                        <LayoutGrid size={18} />
                    </button>

                    <button
                        onClick={onToggleAutoAdvance}
                        className={`p-2 rounded-md transition-colors ${autoAdvance
                            ? "bg-white/10 text-brand-orange shadow-sm"
                            : "text-pro-400 hover:text-white hover:bg-white/5"
                            }`}
                        title={autoAdvance ? "Auto-Advance: ON" : "Auto-Advance: OFF"}
                    >
                        <Film size={18} />
                    </button>
                </div>

                <button className="p-2 text-pro-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors" title="Favorite (Coming Soon)">
                    <Heart size={18} />
                </button>
            </div>

            {/* Center Section: Metadata / Info */}
            <div className="flex flex-col items-center justify-center pointer-events-none opacity-80">
                {fileInfo && (
                    <span className="text-xs font-mono text-pro-400 bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
                        {fileInfo}
                    </span>
                )}
            </div>

            {/* Right Section: View Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-pro-400 bg-pro-800/30 rounded-lg p-1 px-2 border border-white/5">
                    <ZoomOut size={16} className="cursor-pointer hover:text-white" />
                    <div className="w-16 h-1 bg-white/10 rounded-full mx-2 relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-white rounded-full -translate-x-1/2"></div>
                    </div>
                    <ZoomIn size={16} className="cursor-pointer hover:text-white" />
                </div>

                <div className="w-px h-4 bg-white/10"></div>

                <button className="p-2 hover:bg-white/10 rounded-lg text-pro-400 hover:text-white transition-colors" title="File Info">
                    <Info size={18} />
                </button>
            </div>
        </div>
    );
}
