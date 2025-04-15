import { useEffect, useRef, useState } from 'react';
import { gameEngine, GameState } from '~/lib/gameEngine';
import Dialog from './Dialog';

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
    <>
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
      <Dialog text={gameState.dialogText} onClose={handleCloseDialog} />
    </>
  );
}
