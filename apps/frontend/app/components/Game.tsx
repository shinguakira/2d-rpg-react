import { useEffect, useRef } from 'react';
import { gameEngine } from '../lib/gameEngine';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game engine
    gameEngine.init(canvasRef.current);

    // No need for cleanup since gameEngine is a singleton
  }, []);

  return <canvas ref={canvasRef} id="game" />;
}
