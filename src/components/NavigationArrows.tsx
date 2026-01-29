import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationArrowsProps {
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export default function NavigationArrows({ hasPrev, hasNext, onPrev, onNext }: NavigationArrowsProps) {
    return (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Left/Prev Arrow */}
            <div className="pointer-events-auto">
                {hasPrev && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="p-2 bg-transparent hover:bg-black/20 rounded-full text-white/50 hover:text-white transition-all transform hover:scale-110 active:scale-95 group/btn"
                    >
                        <ChevronLeft size={32} className="group-hover/btn:-translate-x-0.5 transition-transform drop-shadow-md" />
                    </button>
                )}
            </div>

            {/* Right/Next Arrow */}
            <div className="pointer-events-auto">
                {hasNext && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="p-2 bg-transparent hover:bg-black/20 rounded-full text-white/50 hover:text-white transition-all transform hover:scale-110 active:scale-95 group/btn"
                    >
                        <ChevronRight size={32} className="group-hover/btn:translate-x-0.5 transition-transform drop-shadow-md" />
                    </button>
                )}
            </div>
        </div>
    );
}
