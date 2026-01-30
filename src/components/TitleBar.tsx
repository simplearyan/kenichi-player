import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, RotateCcw, PenLine, Scissors, Trash2, Fullscreen, Maximize, FullscreenIcon } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

interface TitleBarProps {
    filename?: string;
    mediaType?: 'video' | 'image' | 'audio';
}

export default function TitleBar({ filename, mediaType }: TitleBarProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const appWindow = getCurrentWindow();

    useEffect(() => {
        const checkMaximized = async () => {
            setIsMaximized(await appWindow.isMaximized());
        };

        // Check initially
        checkMaximized();

        // Listen for resize events to update icon state
        const unlisten = appWindow.onResized(() => {
            checkMaximized();
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    const minimize = () => appWindow.minimize();
    const toggleMaximize = async () => {
        if (await appWindow.isMaximized()) {
            appWindow.unmaximize();
        } else {
            appWindow.maximize();
        }
    };
    const close = () => appWindow.close();

    return (
        <div className="h-12 bg-zinc-950/30 backdrop-blur-2xl flex justify-between items-center select-none fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-linear-to-b from-white/5 to-transparent">
            {/* Left: Branding & Logo */}
            <div className="flex h-full items-center pl-4 gap-3 w-[200px]" data-tauri-drag-region>
                <img src={logo} alt="Logo" className="w-5 h-5 opacity-80 pointer-events-none" />
                <span className="text-sm font-medium text-pro-400 pointer-events-none">Kenichi Lite</span>
            </div>

            {/* Center: Filename & Actions */}
            <div className="flex-1 flex items-center justify-center gap-4 h-full" data-tauri-drag-region>
                {/* Filename */}
                {filename && (
                    <span className="text-sm text-white/90 font-medium truncate max-w-[300px] pointer-events-none">
                        {filename}
                    </span>
                )}

                {/* Media Actions Toolbar (Only visible if file loaded) */}
                {filename && (
                    <div className="flex items-center bg-pro-800/50 rounded-lg p-1 gap-0.5 ml-4 border border-white/5">
                        <button className="h-7 px-3 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow rounded-md flex items-center gap-2 transition-colors text-xs font-medium" title="Edit (Coming Soon)">
                            <PenLine size={14} />
                            <span>Edit</span>
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-1"></div>

                        {/* Video/Audio Specific Actions */}
                        {mediaType === 'video' && (
                            <button className="w-8 h-7 flex items-center justify-center text-pro-300 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Trim">
                                <Scissors size={14} />
                            </button>
                        )}

                        <button className="w-8 h-7 flex items-center justify-center text-pro-300 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Rotate">
                            <RotateCcw size={14} />
                        </button>
                        <button className="w-8 h-7 flex items-center justify-center text-pro-300 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Right: Window Controls */}
            <div className="flex items-center h-full w-[200px] justify-end">
                <button
                    onClick={minimize}
                    className="h-full w-12 text-pro-400 hover:bg-pro-800 hover:text-white transition-colors flex items-center justify-center focus:outline-none"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={toggleMaximize}
                    className="h-full w-12 text-pro-400 hover:bg-pro-800 hover:text-white transition-colors flex items-center justify-center focus:outline-none"
                >
                    {isMaximized ? <FullscreenIcon size={14} className="scale-x-[-1]" /> : <Square size={14} />}
                </button>
                <button
                    onClick={close}
                    className="h-full w-12 text-pro-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center focus:outline-none"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
