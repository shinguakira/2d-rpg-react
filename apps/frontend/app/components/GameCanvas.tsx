import { useEffect, useRef, useState } from 'react';
import { gameEngine, GameState } from '~/lib/gameEngine';
import Dialog from './Dialog';
import GameUI from './GameUI';

interface GameCanvasProps {
  width: number;
  height: number;
}

export default function GameCanvas({ width, height }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(gameEngine.getGameState());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game engine
    gameEngine.init(canvas);

    // Update game state periodically
    const interval = setInterval(() => {
      setGameState(gameEngine.getGameState());
    }, 1000 / 30); // 30 FPS state updates

    return () => clearInterval(interval);
  }, []);

  const handleCloseDialog = () => {
    gameEngine.closeDialog();
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          backgroundColor: '#1a1a1a',
        }}
      />
      <GameUI 
        playerHealth={100} 
        score={0} 
        gameTime={gameState.gameTime ? Date.now() - gameState.gameTime : 0} 
      />
      <Dialog text={gameState.dialogText} onClose={handleCloseDialog} />
    </div>
  );
}
