import { useRef, useEffect } from "react";
import { X, Play, Image as ImageIcon, Film, Headset } from "lucide-react";
import { MediaItem } from "../types";

interface FilmstripProps {
    items: MediaItem[];
    currentIndex: number;
    onSelect: (index: number) => void;
    onRemove: (index: number) => void;
    visible: boolean;
}

export default function Filmstrip({ items, currentIndex, onSelect, onRemove, visible }: FilmstripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active item
    useEffect(() => {
        if (scrollRef.current && items[currentIndex]) {
            const activeEl = scrollRef.current.children[currentIndex] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }
    }, [currentIndex, visible]);

    if (!visible || items.length === 0) return null;

    return (
        // Docked at bottom, full width container
        <div className="w-full bg-zinc-950/20 backdrop-blur-lg border-t border-white/5 p-4 animate-slide-up z-40 relative">
            <div className="flex items-center justify-center gap-3 overflow-x-auto custom-scrollbar scroll-smooth pb-0" ref={scrollRef}>
                {items.map((item, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <div
                            key={`${item.path} -${index} `}
                            onClick={() => onSelect(index)}
                            className={`group relative w-36 h-[88px] rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all duration-200 ${isActive
                                ? "border-brand-orange scale-100 z-10"
                                : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            {/* Placeholder / Thumbnail */}
                            <div className="w-full h-full bg-pro-800 flex items-center justify-center text-pro-500">
                                {/* Real thumbnail logic would go here. For now, use Icon based on type */}
                                {(() => {
                                    const isAudio = item.type === 'audio' || item.path.toLowerCase().endsWith('.mp3') || item.path.toLowerCase().endsWith('.wav');
                                    if (item.type === 'video') return <Film size={20} />;
                                    if (isAudio) return <Headset size={20} />;
                                    return <ImageIcon size={20} />;
                                })()}
                            </div>

                            {/* Label Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2">
                                <p className="text-[10px] text-white/90 font-medium truncate w-full">{item.name}</p>
                            </div>

                            {/* Active Indicator (Play Icon) */}
                            {isActive && item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <Play size={16} className="fill-white text-white drop-shadow-lg" />
                                </div>
                            )}

                            {/* Remove Button (Hover only) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
