import { useState, useRef, ReactNode } from "react";

interface TooltipProps {
    children: ReactNode;
    content: string;
    shortcut?: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    className?: string;
}

export default function Tooltip({
    children,
    content,
    shortcut,
    side = "top",
    align = "center",
    className = ""
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            ref={triggerRef}
        >
            {children}

            {isVisible && (
                <div className={`
                    absolute z-50 px-3 py-1.5 
                    bg-zinc-900 border border-white/10 rounded-md shadow-xl 
                    text-xs font-medium text-white/90 whitespace-nowrap
                    flex items-center gap-2
                    animate-in fade-in zoom-in-95 duration-100
                    ${getPositionClasses(side, align)}
                `}>
                    <span>{content}</span>
                    {shortcut && (
                        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider bg-white/5 px-1 rounded border border-white/5">
                            {shortcut}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

function getPositionClasses(side: string, align: string): string {
    let classes = "";

    // Side
    switch (side) {
        case "top":
            classes += "bottom-full mb-2 ";
            break;
        case "bottom":
            classes += "top-full mt-2 ";
            break;
        case "left":
            classes += "right-full mr-2 ";
            break;
        case "right":
            classes += "left-full ml-2 ";
            break;
    }

    // Align (only applies for top/bottom or left/right groupings)
    if (side === "top" || side === "bottom") {
        switch (align) {
            case "start": classes += "left-0 "; break;
            case "center": classes += "left-1/2 -translate-x-1/2 "; break;
            case "end": classes += "right-0 "; break;
        }
    } else {
        switch (align) {
            case "start": classes += "top-0 "; break;
            case "center": classes += "top-1/2 -translate-y-1/2 "; break;
            case "end": classes += "bottom-0 "; break;
        }
    }

    return classes;
}
