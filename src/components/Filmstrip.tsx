import { useRef, useEffect } from "react";
import { X, Play, Image as ImageIcon, Film } from "lucide-react";

export interface MediaItem {
    path: string;
    name: string;
    type: 'video' | 'image';
    thumbnail?: string;
}

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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-[90vw] animate-fade-in-up">
            <div className="bg-pro-900/90 backdrop-blur-md border border-pro-800 rounded-2xl p-2 shadow-2xl flex items-center gap-2 overflow-x-auto no-scrollbar" ref={scrollRef}>
                {items.map((item, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <div
                            key={`${item.path}-${index}`}
                            onClick={() => onSelect(index)}
                            className={`group relative w-32 h-20 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all duration-200 ${isActive
                                    ? "border-brand-orange shadow-[0_0_15px_-3px_var(--color-brand-orange)] scale-105 z-10"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-105 hover:bg-white/5"
                                }`}
                        >
                            {/* Placeholder / Thumbnail */}
                            <div className="w-full h-full bg-pro-950 flex items-center justify-center text-pro-400">
                                {/* Real thumbnail logic would go here. For now, use Icon based on type */}
                                {item.type === 'video' ? <Film size={24} /> : <ImageIcon size={24} />}
                            </div>

                            {/* Label Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                                <p className="text-[10px] text-white font-medium truncate w-full">{item.name}</p>
                            </div>

                            {/* Active Indicator (Play Icon) */}
                            {isActive && item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play size={20} className="fill-white text-white drop-shadow-lg" />
                                </div>
                            )}

                            {/* Remove Button (Hover only) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
