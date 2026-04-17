import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Trophy, Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="h-screen w-screen overflow-hidden text-[#e0e0e5] font-['Helvetica_Neue',Arial,sans-serif]" 
         style={{ background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #050507 100%)' }}>
      <div className="w-full h-full max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr_auto] lg:grid-cols-[280px_1fr_200px] grid-rows-[auto_1fr_auto] lg:grid-rows-[60px_1fr_100px] gap-3 p-3">
        
        {/* Header */}
        <header className="lg:col-span-3 lg:row-span-1 flex items-center justify-between px-5 bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] h-[60px] shrink-0">
           <div className="flex items-center gap-3">
              <Terminal className="text-[#00ffff] w-5 h-5 drop-shadow-[0_0_10px_#00ffff]" />
              <h1 className="font-black text-xl tracking-[2px] text-[#00ffff] drop-shadow-[0_0_10px_#00ffff] uppercase">
                 Synth-Snake
              </h1>
           </div>
           
           <div className="flex gap-8">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] uppercase text-[#80808a]">Score</span>
                 <span className="font-mono text-lg text-[#39ff14] leading-none">{score.toString().padStart(6, '0')}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[10px] uppercase text-[#80808a]">Best</span>
                 <span className="font-mono text-lg text-[#39ff14] leading-none">{highScore.toString().padStart(6, '0')}</span>
              </div>
           </div>
        </header>

        {/* Sidebar */}
        <aside className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
            <h3 className="text-[12px] uppercase tracking-[1px] text-[#80808a] mb-2 font-semibold">AI Generated Playlist</h3>
            <div className="p-2.5 bg-[rgba(255,0,255,0.05)] rounded-md border-l-[3px] border-[#ff00ff] cursor-pointer shrink-0">
                <div className="text-sm font-semibold mb-1">Neon Grinder</div>
                <div className="text-[11px] text-[#80808a]">AI Core // 01</div>
            </div>
            <div className="p-2.5 bg-[rgba(255,255,255,0.03)] rounded-md border-l-[3px] border-transparent transition-colors hover:bg-[rgba(255,255,255,0.08)] cursor-pointer shrink-0">
                <div className="text-sm font-semibold mb-1">Synthetic Pulse</div>
                <div className="text-[11px] text-[#80808a]">AI Core // 02</div>
            </div>
            <div className="p-2.5 bg-[rgba(255,255,255,0.03)] rounded-md border-l-[3px] border-transparent transition-colors hover:bg-[rgba(255,255,255,0.08)] cursor-pointer shrink-0">
                <div className="text-sm font-semibold mb-1">Cybernetic Horizon</div>
                <div className="text-[11px] text-[#80808a]">AI Core // 03</div>
            </div>
        </aside>

        {/* Game Area */}
        <main className="bg-[#000] border-2 border-[#39ff14] shadow-[inset_0_0_30px_rgba(57,255,20,0.2),0_0_15px_rgba(57,255,20,0.1)] rounded-lg relative flex items-center justify-center overflow-hidden min-h-0">
            <SnakeGame onScoreUpdate={handleScoreUpdate} isGameActiveCallback={setIsGameActive} />
        </main>

        {/* Right Bar */}
        <aside className="bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 hidden lg:block overflow-y-auto">
            <div className="mb-6">
                <h4 className="text-[10px] text-[#80808a] uppercase mb-2 font-semibold">Game Controls</h4>
                <p className="text-xs leading-relaxed text-[#b0b0bc]">Use WASD or Arrow Keys to navigate the synth-grid.</p>
            </div>
            <div className="mb-6">
                <h4 className="text-[10px] text-[#80808a] uppercase mb-2 font-semibold">Engine Stats</h4>
                <p className="text-xs leading-relaxed text-[#b0b0bc]">BPM Sync: Active</p>
                <p className="text-xs leading-relaxed text-[#b0b0bc]">Latency: 4ms</p>
                <p className="text-xs leading-relaxed text-[#b0b0bc]">FPS: 60</p>
            </div>
            <div className="mb-6">
                <h4 className="text-[10px] text-[#80808a] uppercase mb-2 font-semibold">AI Meta</h4>
                <p className="text-xs leading-relaxed text-[#b0b0bc]">Current tracks generated via SoundHelix.</p>
            </div>
        </aside>

        {/* Footer Player */}
        <MusicPlayer />
      </div>
    </div>
  )
}
