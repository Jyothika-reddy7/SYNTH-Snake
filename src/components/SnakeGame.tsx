import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Power } from 'lucide-react';

const GRID_SIZE = 25;
const CELL_SIZE = 20;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number, y: number };

const INITIAL_SNAKE = [
  { x: 12, y: 12 },
  { x: 12, y: 13 },
  { x: 12, y: 14 }
];
const INITIAL_DIR = { x: 0, y: -1 };

export function SnakeGame({ onScoreUpdate, isGameActiveCallback }: { onScoreUpdate: (score: number) => void, isGameActiveCallback: (active: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Point>(INITIAL_DIR);
  const dirRef = useRef(INITIAL_DIR);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setLocalScore(0);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    });
  }, []);

  useEffect(() => {
    onScoreUpdate(localScore);
  }, [localScore, onScoreUpdate]);

  useEffect(() => {
    isGameActiveCallback(hasStarted && !isPaused && !gameOver);
  }, [hasStarted, isPaused, gameOver, isGameActiveCallback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture spacebar if active element is a button (e.g., play music)
      if (e.key === ' ' && document.activeElement?.tagName === 'BUTTON') {
        return;
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      const { x, y } = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) dirRef.current = { x: 0, y: -1 };
          if (!hasStarted && !gameOver) resetGame();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) dirRef.current = { x: 0, y: 1 };
          if (!hasStarted && !gameOver) resetGame();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) dirRef.current = { x: -1, y: 0 };
          if (!hasStarted && !gameOver) resetGame();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) dirRef.current = { x: 1, y: 0 };
          if (!hasStarted && !gameOver) resetGame();
          break;
        case ' ':
          if (gameOver) {
            resetGame();
          } else {
            setIsPaused(p => !p);
            if (!hasStarted) setHasStarted(true);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted, resetGame]);

  useEffect(() => {
    if (isPaused || gameOver || !hasStarted) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setSnake(prev => {
        const head = prev[0];
        const currentDir = dirRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };
        
        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }
        
        // Self collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setLocalScore(s => s + 10);
          
          // Generate new food that doesn't overlap snake
          let nextFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) } as Point;
          while (newSnake.some(s => s.x === nextFood.x && s.y === nextFood.y)) {
            nextFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
          }
          setFood(nextFood);
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
      
      setDir(dirRef.current);
    };

    // Decrease tick rate slightly as score increases (max speed 60ms)
    const speed = Math.max(60, 120 - Math.floor(localScore / 50) * 5);
    timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [snake, isPaused, gameOver, hasStarted, food, localScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Grid lines (simulate the .cell gap)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, BOARD_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(BOARD_SIZE, i);
      ctx.stroke();
    }

    // Food (neon-pink)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake (neon-green for body, white for head)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#39ff14';
      ctx.shadowBlur = index === 0 ? 12 : 8;
      ctx.shadowColor = index === 0 ? '#ffffff' : '#39ff14';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * CELL_SIZE + padding, 
        segment.y * CELL_SIZE + padding, 
        CELL_SIZE - padding * 2, 
        CELL_SIZE - padding * 2
      );
    });

    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className={`relative border-2 ${hasStarted && !isPaused && !gameOver ? 'border-[#39ff14] shadow-[inset_0_0_30px_rgba(57,255,20,0.2),0_0_15px_rgba(57,255,20,0.1)]' : 'border-[rgba(255,255,255,0.1)] shadow-none'} rounded-lg overflow-hidden transition-all duration-300 bg-[#000] w-full h-full flex items-center justify-center`}>
      <canvas 
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        className="block"
      />
      
      {(!hasStarted || isPaused || gameOver) && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
          {gameOver ? (
            <div className="text-center animate-in zoom-in duration-300 pointer-events-auto">
              <h2 className="text-4xl font-black uppercase tracking-[2px] text-[#ff00ff] drop-shadow-[0_0_15px_#ff00ff] mb-2">System Failure</h2>
              <p className="text-[#00ffff] font-mono mb-6 shadow-black drop-shadow-md">Final Score: {localScore}</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-[rgba(255,0,255,0.1)] border border-[#ff00ff] hover:bg-[rgba(255,0,255,0.2)] text-[#ff00ff] rounded uppercase font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)]"
              >
                <RotateCcw className="w-5 h-5" /> Reboot
              </button>
              <p className="mt-4 text-[10px] font-mono text-[#80808a]">Press Space to reboot</p>
            </div>
          ) : !hasStarted ? (
            <div className="text-center pointer-events-auto">
              <Power className="w-16 h-16 mx-auto text-[#39ff14] drop-shadow-[0_0_15px_#39ff14] mb-6 animate-pulse" />
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-[rgba(57,255,20,0.1)] border border-[#39ff14] hover:bg-[rgba(57,255,20,0.2)] text-[#39ff14] rounded uppercase font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(57,255,20,0.5)] flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" /> Initialize
              </button>
              <p className="mt-4 text-[10px] font-mono text-[#80808a]">Press WASD or Arrows to maneuver</p>
            </div>
          ) : isPaused ? (
            <div className="text-center pointer-events-auto">
               <h2 className="text-3xl font-black uppercase tracking-[2px] text-[#00ffff] drop-shadow-[0_0_15px_#00ffff] mb-6">Paused</h2>
               <button 
                onClick={() => { setIsPaused(false); setHasStarted(true); }}
                className="px-8 py-3 bg-[rgba(0,255,255,0.1)] border border-[#00ffff] hover:bg-[rgba(0,255,255,0.2)] text-[#00ffff] rounded uppercase font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)] flex items-center gap-2 mx-auto"
              >
                 <Play className="w-5 h-5" /> Resume
              </button>
              <p className="mt-4 text-[10px] font-mono text-[#80808a]">Press Space to resume</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
