import { useMediaState } from "@vidstack/react";
import { Music } from "lucide-react";

export default function AudioVisualizer() {
    const isPaused = useMediaState("paused");

    // We create a simple pseudo-visualizer with CSS animations
    // In a real app, we'd use Web Audio API for frequency data
    const bars = Array.from({ length: 20 }, (_, i) => i);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-500 z-0">
            {/* Animated Disc / Icon Area */}
            <div className="relative group">
                <div className={`w-40 h-40 rounded-full bg-linear-to-br from-brand-yellow/20 to-brand-orange/20 backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(56,189,248,0.15)] ${!isPaused ? 'animate-pulse' : ''}`}>
                    <div className={`p-8 rounded-full bg-zinc-900 shadow-xl border border-white/5 transition-transform duration-500 ${!isPaused ? 'scale-110' : 'scale-100'}`}>
                        <Music size={48} className="text-brand-yellow drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                    </div>
                </div>

                {/* Orbital Rings */}
                <div className={`absolute -inset-4 rounded-full border border-white/5 ${!isPaused ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
                <div className={`absolute -inset-8 rounded-full border border-white/5 opacity-50 ${!isPaused ? 'animate-[spin_8s_linear_infinite_reverse]' : ''}`}></div>
            </div>

            {/* Pulsing "Waveform" */}
            <div className="flex items-end gap-1.5 h-16">
                {bars.map((bar) => {
                    // Random-ish heights for a more organic feel
                    const height = 20 + Math.random() * 80;
                    const delay = bar * 0.05;

                    return (
                        <div
                            key={bar}
                            className={`w-1 rounded-full bg-linear-to-t from-brand-yellow to-brand-orange transition-all duration-300 ${!isPaused ? 'animate-bounce' : 'h-2 opacity-30'}`}
                            style={{
                                height: !isPaused ? `${height}%` : '8px',
                                animationDelay: `${delay}s`,
                                animationDuration: '0.8s'
                            }}
                        />
                    );
                })}
            </div>

            {/* Ambient Glow */}
            <div className={`absolute -z-10 w-96 h-96 bg-brand-yellow/5 rounded-full blur-[100px] transition-opacity duration-1000 ${!isPaused ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
    );
}
