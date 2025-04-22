import { useAtom, useAtomValue } from 'jotai';
import { gameTimeAtom, isSettingsOpenAtom } from '../lib/store';
import { Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';

export default function GameUI() {
  const gameTime = useAtomValue(gameTimeAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useAtom(isSettingsOpenAtom);
  const playerHealth = 100; // This would come from a store in a full implementation
  const score = 0; // This would come from a store in a full implementation
  
  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor((Date.now() - timeInMs) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
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
              <span className="text-xs">Health</span>
              <span className="text-lg">{playerHealth}/100</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-2xl">⭐</span>
            <div className="flex flex-col">
              <span className="text-xs">Score</span>
              <span className="text-lg">{score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs">Time</span>
            <span className="text-lg">{formatTime(gameTime)}</span>
          </div>
        </div>
      </div>
      
      {/* Settings Button */}
      <button
        className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSettingsOpen(true)}
        title="Settings"
      >
        <SettingsIcon size={24} />
      </button>
      
      {/* Settings Modal */}
      <Settings />
    </>
  );
}
