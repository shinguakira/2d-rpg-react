import { useEffect, useRef } from 'react';
import { atom, useAtom } from 'jotai';
import type { KaplayContext, GameState, Vec2 } from './kaplayTypes';

const gameStateAtom = atom<GameState>({
  player: {
    pos: { x: 0, y: 0, eq: () => false },
    direction: { x: 0, y: 0, eq: () => false },
    currentAnimation: 'idle'
  },
  npcs: [],
  scene: 'main'
});

export function useKaplay(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const kRef = useRef<KaplayContext | null>(null);

  useEffect(() => {
    if (!canvasRef.current || kRef.current) return;

    // Initialize Kaplay context
    const k: KaplayContext = {
      vec2: (x: number, y: number): Vec2 => ({
        x,
        y,
        eq: function(other: Vec2) {
          return this.x === other.x && this.y === other.y;
        }
      }),
      isKeyDown: (key: string) => {
        // Implement key detection
        const keys = {
          left: false,
          right: false,
          up: false,
          down: false,
          space: false
        };
        return keys[key as keyof typeof keys] || false;
      },
      add: (config) => {
        // Create sprite instance
        const sprite = {
          pos: k.vec2(config.pos?.x || 0, config.pos?.y || 0),
          scale: k.vec2(config.scale?.x || 1, config.scale?.y || 1),
          direction: k.vec2(0, 0),
          speed: config.speed || 100,
          play: (animationName: string) => {
            setGameState(prev => ({
              ...prev,
              player: {
                ...prev.player,
                currentAnimation: animationName
              }
            }));
          },
          getCurAnim: () => ({ name: gameState.player.currentAnimation }),
          onUpdate: (callback: () => void) => {
            // Set up animation frame loop for sprite updates
            let animationFrameId: number;
            const update = () => {
              callback();
              animationFrameId = requestAnimationFrame(update);
            };
            update();
            return () => cancelAnimationFrame(animationFrameId);
          }
        };
        return sprite;
      },
      loadSprite: (name: string, config: any) => {
        // Load sprite assets
        console.log('Loading sprite:', name, config);
      },
      scene: gameState.scene,
      go: (sceneName: string) => {
        setGameState(prev => ({ ...prev, scene: sceneName }));
      }
    };

    kRef.current = k;

    return () => {
      kRef.current = null;
    };
  }, [canvasRef, gameState.player.currentAnimation, gameState.scene, setGameState]);

  return kRef.current;
}
