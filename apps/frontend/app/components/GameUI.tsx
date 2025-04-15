import { useAtomValue } from 'jotai';
import { gameTimeAtom } from '~/lib/store';

export default function GameUI() {
  const gameTime = useAtomValue(gameTimeAtom);
  const playerHealth = 100; // This would come from a store in a full implementation
  const score = 0; // This would come from a store in a full implementation
  
  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor((Date.now() - timeInMs) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="absolute top-4 left-4 right-4 flex justify-between items-center p-4 text-white"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        border: '2px solid #444',
        fontFamily: 'monospace',
        imageRendering: 'pixelated',
        padding: '12px',
        borderRadius: '4px'
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl">❤</span>
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Health</span>
            <span className="font-bold">{playerHealth}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <span className="text-blue-400 text-2xl">⏱</span>
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Time</span>
            <span className="font-bold">{formatTime(gameTime)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-yellow-500 text-2xl">⭐</span>
        <div className="flex flex-col">
          <span className="text-sm opacity-70">Score</span>
          <span className="font-bold">{score}</span>
        </div>
      </div>
    </div>
  );
}
