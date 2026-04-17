import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Grinder", artist: "AI Core // 01", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Synthetic Pulse", artist: "AI Core // 02", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Cybernetic Horizon", artist: "AI Core // 03", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIdx];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
         audioRef.current.play().catch(e => {
           console.log('Audio autoplay prevented on track change', e);
           setIsPlaying(false);
         });
      }
    }
  }, [currentTrackIdx, volume]); // Removed isPlaying from deps to avoid double-play attempts
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  return (
    <footer className="lg:col-span-3 bg-[rgba(20,20,25,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg flex flex-col md:flex-row items-center px-6 py-4 gap-4 md:gap-10 relative overflow-hidden h-full">
      {/* Visualizer effect top bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[rgba(255,255,255,0.1)]">
         <div 
           className="h-full bg-[#00ffff] shadow-[0_0_10px_#00ffff] transition-all duration-300"
           style={{ width: `${progress}%` }}
         />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />

      {/* now-playing container */}
      <div className="flex items-center gap-4 w-full md:w-[250px] shrink-0">
        <div className="w-[60px] h-[60px] rounded bg-gradient-to-tr from-[#ff00ff] to-[#00ffff] flex items-center justify-center shadow-lg relative overflow-hidden">
           <Disc3 className={`w-8 h-8 text-black opacity-50 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
        </div>
        <div className="overflow-hidden flex flex-col justify-center">
          <h3 className="font-semibold text-sm text-[#e0e0e5] truncate">
            {currentTrack.title}
          </h3>
          <p className="text-[11px] text-[#80808a] truncate mt-1">{currentTrack.artist}</p>
        </div>
      </div>

      {/* playback-controls */}
      <div className="flex-1 flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="text-[#e0e0e5] hover:text-[#00ffff] transition-colors bg-transparent border-none cursor-pointer">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-11 h-11 bg-[#e0e0e5] text-[#050507] rounded-full flex items-center justify-center hover:bg-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] border-none cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current ml-0.5" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-1" />
            )}
          </button>

          <button onClick={nextTrack} className="text-[#e0e0e5] hover:text-[#00ffff] transition-colors bg-transparent border-none cursor-pointer">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
      
      {/* volume-control */}
      <div className="flex items-center justify-end gap-3 w-full md:w-[150px] text-[#80808a]">
         <Volume2 className="w-4 h-4" />
         <div className="flex-1 h-1 relative bg-[rgba(255,255,255,0.1)] rounded">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="h-full bg-[#80808a] rounded pointer-events-none absolute top-0 left-0" 
              style={{ width: `${volume * 100}%` }}
            />
         </div>
      </div>
    </footer>
  );
}
