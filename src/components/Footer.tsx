import { Film, Info, LayoutGrid } from "lucide-react";

interface FooterProps {
    fileName: string;
    fileInfo?: string;
    filmstripVisible: boolean;
    onToggleFilmstrip: () => void;
    autoAdvance: boolean;
    onToggleAutoAdvance: () => void;
}

export default function Footer({ fileName, fileInfo, filmstripVisible, onToggleFilmstrip, autoAdvance, onToggleAutoAdvance }: FooterProps) {
    return (
        <div className="h-14 bg-pro-950 flex items-center justify-between px-6 select-none z-50">
            {/* Left: Filmstrip Toggle & Info */}
            {/* Left: Filmstrip Toggle & Info */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleFilmstrip}
                    className={`p-2 rounded-lg transition-colors ${filmstripVisible
                            ? "text-brand-yellow "
                            : "text-pro-400 "
                        }`}
                    title={filmstripVisible ? "Hide Filmstrip" : "Show Filmstrip"}
                >
                    <LayoutGrid size={20} />
                </button>

                <div className="h-4 w-px bg-pro-800"></div>

                <button
                    onClick={onToggleAutoAdvance}
                    className={`p-2 rounded-lg transition-colors ${autoAdvance
                            ? "text-brand-orange "
                            : "text-pro-400"
                        }`}
                    title={autoAdvance ? "Auto-Advance: ON" : "Auto-Advance: OFF"}
                >
                    <Film size={20} />
                </button>

                <div className="h-4 w-px bg-pro-800"></div>

                <div className="flex flex-col justify-center">
                    <span className="text-sm text-white font-medium truncate max-w-[300px]" title={fileName}>
                        {fileName}
                    </span>
                    {fileInfo && (
                        <span className="text-xs text-pro-400">
                            {fileInfo}
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Actions (Placeholder for Zoom/Fit in future) */}
            <div className="flex items-center gap-2 text-pro-400">
                {/* Could add Zoom controls here later */}
                <button className="p-2 hover:bg-white/10 rounded-lg hover:text-white transition-colors" title="File Info">
                    <Info size={18} />
                </button>
            </div>
        </div>
    );
}
