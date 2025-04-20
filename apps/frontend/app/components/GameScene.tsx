import { useEffect, useRef } from 'react';
import { useKaplay } from '~/lib/useKaplay';
import type { Sprite } from '~/lib/kaplayTypes';

export default function GameScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Sprite | null>(null);
  const k = useKaplay(canvasRef);

  useEffect(() => {
    if (!k) return;

    // Load sprite assets
    k.loadSprite('player', {
      src: '/sprites/player.png',
      animations: {
        idle: { frames: [0], loop: true },
        left: { frames: [1, 2, 3], loop: true },
        right: { frames: [4, 5, 6], loop: true },
        up: { frames: [7, 8, 9], loop: true },
        down: { frames: [10, 11, 12], loop: true }
      }
    });

    // Add player sprite
    const player = k.add([
      {
        pos: k.vec2(100, 100),
        scale: k.vec2(2, 2),
        speed: 800,
        direction: k.vec2(0, 0),
      },
    ]);

    playerRef.current = player;

    // Set up player movement
    player.onUpdate(() => {
      player.direction.x = 0;
      player.direction.y = 0;

      if (k.isKeyDown('left')) player.direction.x = -1;
      if (k.isKeyDown('right')) player.direction.x = 1;
      if (k.isKeyDown('up')) player.direction.y = -1;
      if (k.isKeyDown('down')) player.direction.y = 1;

      // Update animations based on direction
      if (player.direction.eq(k.vec2(-1, 0)) && player.getCurAnim().name !== 'left') {
        player.play('left');
      }
      if (player.direction.eq(k.vec2(1, 0)) && player.getCurAnim().name !== 'right') {
        player.play('right');
      }
      if (player.direction.eq(k.vec2(0, -1)) && player.getCurAnim().name !== 'up') {
        player.play('up');
      }
      if (player.direction.eq(k.vec2(0, 1)) && player.getCurAnim().name !== 'down') {
        player.play('down');
      }
      if (player.direction.eq(k.vec2(0, 0)) && player.getCurAnim().name !== 'idle') {
        player.play('idle');
      }
    });

    return () => {
      playerRef.current = null;
    };
  }, [k]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
