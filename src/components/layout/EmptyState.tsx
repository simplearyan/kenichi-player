import logo from "../../assets/logo.png";

interface EmptyStateProps {
    onOpen: () => void;
}

export default function EmptyState({ onOpen }: EmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in pt-10">
            {/* Card Container */}
            <div className="w-[480px] rounded-3xl p-10 flex flex-col items-center ">
                <div className="mb-6 relative">
                    <img src={logo} alt="Kenichi Lite Logo" className="w-24 h-24 " />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    <span className="bg-linear-to-br from-brand-yellow to-brand-orange bg-clip-text text-transparent">Kenichi</span>{" "}
                    <span className="text-white">Lite</span>
                </h1>
                <p className="text-pro-400 text-sm mb-8 text-center leading-relaxed">
                    High-performance media playback.<br />
                    Drag and drop folders or files.
                </p>
                <div className="w-full flex flex-col items-center gap-4">
                    <button
                        onClick={onOpen}
                        className="group relative w-full py-3.5 px-6 rounded-xl font-bold text-pro-950 bg-linear-to-r from-brand-yellow to-brand-orange hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                            Open Media
                        </span>
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                    </button>
                </div>
            </div>
            <div className="text-xs text-pro-800 font-mono mt-8">v0.1.0 • rust • wgpu</div>
        </div>
    );
}
