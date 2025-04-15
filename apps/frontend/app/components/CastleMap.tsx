import { useEffect, useRef, useState } from 'react';
import { GameMap, Character } from '~/lib/mapData';
import Dialog from './Dialog';

interface CastleMapProps {
  map: GameMap;
  onExitMap?: () => void;
}

export default function CastleMap({ map, onExitMap }: CastleMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 7, y: 10 });
  const [facingDirection, setFacingDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [showDialog, setShowDialog] = useState(false);

  const playerCharacter = map.characters.find(char => char.id === 'player');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDialog) {
        if (e.code === 'Space') {
          handleDialogAdvance();
        }
        return;
      }

      let newX = playerPosition.x;
      let newY = playerPosition.y;
      let newDirection = facingDirection;

      switch (e.code) {
        case 'ArrowUp':
          newY -= 1;
          newDirection = 'up';
          break;
        case 'ArrowDown':
          newY += 1;
          newDirection = 'down';
          break;
        case 'ArrowLeft':
          newX -= 1;
          newDirection = 'left';
          break;
        case 'ArrowRight':
          newX += 1;
          newDirection = 'right';
          break;
        case 'Space':
          handleInteraction();
          break;
      }

      const isTileWalkable = map.tiles.find(
        tile => tile.x === newX && tile.y === newY
      )?.walkable ?? true;

      const characterAtPosition = map.characters.find(
        char => char.id !== 'player' && char.x === newX && char.y === newY
      );

      if (isTileWalkable && !characterAtPosition) {
        setPlayerPosition({ x: newX, y: newY });
      }

      setFacingDirection(newDirection);

      if (playerCharacter) {
        playerCharacter.x = newX;
        playerCharacter.y = newY;
        playerCharacter.direction = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, facingDirection, showDialog, map, playerCharacter]);

  const handleInteraction = () => {
    const facingX = playerPosition.x + (facingDirection === 'right' ? 1 : facingDirection === 'left' ? -1 : 0);
    const facingY = playerPosition.y + (facingDirection === 'down' ? 1 : facingDirection === 'up' ? -1 : 0);

    const character = map.characters.find(
      char => char.id !== 'player' && char.x === facingX && char.y === facingY
    );

    if (character && character.dialog.length > 0) {
      setActiveCharacter(character);
      setDialogIndex(0);
      setShowDialog(true);
    }
  };

  const handleDialogAdvance = () => {
    if (!activeCharacter) return;

    if (dialogIndex < activeCharacter.dialog.length - 1) {
      setDialogIndex(dialogIndex + 1);
    } else {
      setShowDialog(false);
      setActiveCharacter(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tileSize = 40;

    map.tiles.forEach(tile => {
      const x = tile.x * tileSize;
      const y = tile.y * tileSize;

      switch (tile.type) {
        case 'floor':
          ctx.fillStyle = '#a89078';
          ctx.fillRect(x, y, tileSize, tileSize);
          break;
        case 'carpet':
          ctx.fillStyle = '#a82c2c';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
          break;
        case 'throne':
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(x + 5, y + 5, tileSize - 10, tileSize - 10);
          break;
        case 'bookshelf':
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x, y, tileSize, tileSize);
          for (let i = 0; i < 3; i++) {
            ctx.fillStyle = ['#a82c2c', '#2c5aa8', '#2ca82c'][i % 3];
            ctx.fillRect(x + 5 + (i * 10), y + 5, 8, tileSize - 10);
          }
          break;
        case 'table':
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x + 5, y + 5, tileSize - 10, tileSize - 10);
          ctx.fillStyle = '#f0f0f0';
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + tileSize/2, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'window':
          ctx.fillStyle = '#87ceeb';
          ctx.fillRect(x + 5, y + 5, tileSize - 10, tileSize - 20);
          ctx.strokeStyle = '#8b4513';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 5, y + 5, tileSize - 10, tileSize - 20);
          break;
        case 'banner':
          ctx.fillStyle = '#a82c2c';
          ctx.fillRect(x + 10, y, tileSize - 20, tileSize);
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + tileSize/2, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'torch':
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x + 15, y, tileSize - 30, tileSize - 20);
          ctx.fillStyle = '#ffa500';
          ctx.beginPath();
          ctx.arc(x + tileSize/2, y + 10, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'door':
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(x + tileSize/4, y + tileSize/2, 3, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    });

    map.characters.forEach(character => {
      const x = character.x * tileSize;
      const y = character.y * tileSize;

      let bodyColor = '#5b6ee1'; // Default blue
      
      if (character.role === 'ruler') {
        bodyColor = '#ffd700'; // Gold for king
      } else if (character.role === 'advisor') {
        bodyColor = '#a82c2c'; // Red for advisor
      } else if (character.role === 'knight' || character.role === 'guard') {
        bodyColor = '#2c5aa8'; // Blue for knights/guards
      }
      
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x + 10, y + 10, tileSize - 20, tileSize - 20);
      
      ctx.fillStyle = '#f0d0b0'; // Skin tone
      ctx.beginPath();
      ctx.arc(x + tileSize/2, y + tileSize/3, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      switch (character.direction) {
        case 'up':
          ctx.fillRect(x + tileSize/2 - 4, y + tileSize/3 - 2, 2, 2);
          ctx.fillRect(x + tileSize/2 + 2, y + tileSize/3 - 2, 2, 2);
          break;
        case 'down':
          ctx.fillRect(x + tileSize/2 - 4, y + tileSize/3 + 2, 2, 2);
          ctx.fillRect(x + tileSize/2 + 2, y + tileSize/3 + 2, 2, 2);
          break;
        case 'left':
          ctx.fillRect(x + tileSize/2 - 4, y + tileSize/3, 2, 2);
          ctx.fillRect(x + tileSize/2 - 2, y + tileSize/3, 2, 2);
          break;
        case 'right':
          ctx.fillRect(x + tileSize/2 + 2, y + tileSize/3, 2, 2);
          ctx.fillRect(x + tileSize/2 + 4, y + tileSize/3, 2, 2);
          break;
      }
      
      if (character.role === 'ruler') {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(x + tileSize/2 - 8, y + tileSize/3 - 8);
        ctx.lineTo(x + tileSize/2 + 8, y + tileSize/3 - 8);
        ctx.lineTo(x + tileSize/2 + 5, y + tileSize/3 - 12);
        ctx.lineTo(x + tileSize/2, y + tileSize/3 - 8);
        ctx.lineTo(x + tileSize/2 - 5, y + tileSize/3 - 12);
        ctx.closePath();
        ctx.fill();
      }
    });

  }, [map, playerPosition, facingDirection]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={map.width * 40} 
        height={map.height * 40}
        className="border-4 border-amber-800 shadow-lg"
      />
      
      {showDialog && activeCharacter && (
        <Dialog 
          text={activeCharacter.dialog[dialogIndex]} 
          onClose={handleDialogAdvance} 
        />
      )}
      
      <div className="mt-4 text-gray-200 text-center">
        <p>Use arrow keys to move</p>
        <p>Press Space to interact with characters</p>
      </div>
    </div>
  );
}
