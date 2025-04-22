import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { gameEngine, GameState } from '../lib/gameEngine';
import Dialog from './Dialog';
import GameUI from './GameUI';
import { 
  dialogTextAtom, 
  isDialogVisibleAtom, 
  gameTimeAtom,
  dialogMessagesAtom,
  dialogIndexAtom,
  isSettingsOpenAtom,
  store
} from '../lib/store';
import GameBoyTextBox from './GameBoyTextBox';
import SettingsIcon from './SettingsIcon';
import Settings from './Settings';
import DebugButton from './DebugButton';

interface GameCanvasProps {
  width: number;
  height: number;
}

export default function GameCanvas({ width, height }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>(gameEngine.getGameState());
  const [, setDialogText] = useAtom(dialogTextAtom);
  const [, setIsDialogVisible] = useAtom(isDialogVisibleAtom);
  const [, setGameTime] = useAtom(gameTimeAtom);
  const [, setDialogMessages] = useAtom(dialogMessagesAtom);
  const [, setDialogIndex] = useAtom(dialogIndexAtom);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useAtom(isSettingsOpenAtom);

  // Handle full screen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      // Only update dialog state if it has changed
      if (state.dialogText && state.isInDialog) {
        setDialogText(state.dialogText);
        setIsDialogVisible(true);
        setDialogMessages(state.dialogMessages);
        setDialogIndex(state.dialogIndex);
      } else if (!state.isInDialog || !state.dialogText) {
        // Dialog is closed in the game engine, so close it in the UI
        setDialogText(null);
        setIsDialogVisible(false);
        setDialogMessages([]);
        setDialogIndex(0);
      }
      
      if (state.gameTime) {
        setGameTime(state.gameTime);
      }
    }, 1000 / 30); // 30 FPS state updates

    return () => clearInterval(interval);
  }, [setDialogText, setIsDialogVisible, setGameTime, setDialogMessages, setDialogIndex]);

  // Update game engine when dialog is closed via Jotai store
  useEffect(() => {
    // Create a listener for the isDialogVisible atom
    const unsubscribe = store.sub(isDialogVisibleAtom, () => {
      // If dialog is closed in the UI but still open in the game engine, close it in the game engine
      const isVisible = store.get(isDialogVisibleAtom);
      const gameState = gameEngine.getGameState();
      
      if (!isVisible && gameState.isInDialog) {
        gameEngine.closeDialog();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Get current dialog state
      const gameState = gameEngine.getGameState();
      
      // Only allow fullscreen toggle when not in dialog
      if ((e.key === 'f' || e.key === 'F') && !gameState.isInDialog) {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-black flex flex-col"
      style={{ touchAction: 'none' }}
    >
      <div className="absolute top-2 right-2 z-50 flex space-x-2">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-black/50 text-white px-2 py-1 rounded hover:bg-black/70 text-xs flex items-center"
        >
          <SettingsIcon size={14} className="mr-1" />
          Settings
        </button>
        <button 
          onClick={toggleFullScreen}
          className="bg-black/50 text-white px-2 py-1 rounded hover:bg-black/70 text-xs"
        >
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <DebugButton />
      </div>

      <div className="flex-grow flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100vh',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            backgroundColor: '#1a1a1a',
          }}
        />
      </div>
      <GameBoyTextBox />
      {isSettingsOpen && <Settings />}
    </div>
  );
}
