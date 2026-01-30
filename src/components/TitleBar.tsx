import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, RotateCcw, PenLine, Scissors, Trash2, FullscreenIcon } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

interface TitleBarProps {
    filename?: string;
    mediaType?: 'video' | 'image' | 'audio';
    hidden?: boolean;
}

export default function TitleBar({ filename, mediaType, hidden = false }: TitleBarProps) {
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
        <div className={`h-12 bg-zinc-950/30 backdrop-blur-2xl flex justify-between items-center select-none fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-linear-to-b from-white/5 to-transparent ${hidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
            {/* Left: Branding & Logo */}
            <div className="flex h-full items-center pl-4 gap-3 w-[250px]" data-tauri-drag-region>
                <div className="relative group">
                    <div className="absolute inset-0 bg-brand-orange/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={logo} alt="Logo" className="w-6 h-6 object-contain relative transition-transform group-hover:scale-110 duration-300" />
                </div>
                <div className="flex flex-col -gap-1">
                    <span className="text-sm font-bold tracking-tight text-white/90">KENICHI</span>
                    <span className="text-[10px] font-medium tracking-widest text-brand-orange/80 -mt-1 uppercase">Lite</span>
                </div>
            </div>

            {/* Center: Filename & Actions */}
            <div className="flex-1 flex items-center justify-center gap-4 h-full" data-tauri-drag-region>
                {/* Filename */}
                {filename && (
                    <span className="text-sm text-white/70 font-medium truncate max-w-[400px] pointer-events-none">
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
