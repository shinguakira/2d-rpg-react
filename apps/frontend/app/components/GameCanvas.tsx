import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { gameEngine, GameState } from '~/lib/gameEngine';
import Dialog from './Dialog';
import GameUI from './GameUI';
import { dialogTextAtom, isDialogVisibleAtom, gameTimeAtom } from '~/lib/store';

interface GameCanvasProps {
  width: number;
  height: number;
}

export default function GameCanvas({ width, height }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(gameEngine.getGameState());
  const [, setDialogText] = useAtom(dialogTextAtom);
  const [, setIsDialogVisible] = useAtom(isDialogVisibleAtom);
  const [, setGameTime] = useAtom(gameTimeAtom);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game engine
    gameEngine.init(canvas);

    // Update game state periodically
    const interval = setInterval(() => {
      const state = gameEngine.getGameState();
      setGameState(state);
      
      // Update Jotai store with game state
      if (state.dialogText) {
        setDialogText(state.dialogText);
        setIsDialogVisible(true);
      }
      
      if (state.gameTime) {
        setGameTime(state.gameTime);
      }
    }, 1000 / 30); // 30 FPS state updates

    return () => clearInterval(interval);
  }, [setDialogText, setIsDialogVisible, setGameTime]);

  // Update game engine when dialog is closed via Jotai store
  useEffect(() => {
    const originalCloseDialog = gameEngine.closeDialog;
    
    gameEngine.closeDialog = () => {
      originalCloseDialog();
      setDialogText(null);
      setIsDialogVisible(false);
    };
    
    return () => {
      gameEngine.closeDialog = originalCloseDialog;
    };
  }, [setDialogText, setIsDialogVisible]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100vh',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          backgroundColor: '#1a1a1a',
        }}
      />
      <GameUI />
      <Dialog />
    </div>
  );
}
