import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function TitleBar() {
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
        <div className="h-10 bg-pro-950 flex justify-between items-center select-none fixed top-0 left-0 right-0 z-50 border-b border-pro-800">
            {/* Drag Region covering the left side and center */}
            <div className="flex-1 h-full flex items-center pl-4 gap-3" data-tauri-drag-region>
                <img src={logo} alt="Logo" className="w-5 h-5 opacity-80 pointer-events-none" />
                <span className="text-sm font-medium text-pro-400 pointer-events-none">Kenichi Lite</span>
            </div>

            {/* Right: Window Controls (NO DRAG REGION HERE) */}
            <div className="flex items-center h-full z-50">
                <button
                    onClick={minimize}
                    className="h-full px-4 text-pro-400 hover:bg-pro-800 hover:text-white transition-colors flex items-center justify-center focus:outline-none"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={toggleMaximize}
                    className="h-full px-4 text-pro-400 hover:bg-pro-800 hover:text-white transition-colors flex items-center justify-center focus:outline-none"
                >
                    {isMaximized ? <RotateCcw size={14} className="scale-x-[-1]" /> : <Square size={14} />}
                </button>
                <button
                    onClick={close}
                    className="h-full px-4 text-pro-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center focus:outline-none"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
