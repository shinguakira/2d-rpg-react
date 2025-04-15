import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Dialog from './Dialog';

interface Character {
  id: string;
  name: string;
  x: number;
  y: number;
  spriteIndex: number;
  dialog: string[];
}

interface KingsRoomProps {
  onExitRoom?: () => void;
}

export default function KingsRoom({ onExitRoom }: KingsRoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 200, y: 300 });
  const [facingDirection, setFacingDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  
  const characters: Character[] = [
    {
      id: 'king',
      name: 'King Gloopius',
      x: 250,
      y: 150,
      spriteIndex: 0,
      dialog: [
        "Welcome to Syralune, brave adventurer!",
        "I am King Gloopius. I... uh... may have accidentally eaten the Jellyblade.",
        "The kingdom is in danger from the Snack Lords. We need your help!",
        "You must find the Jellyseed and regrow the Jellyblade to save us all."
      ]
    },
    {
      id: 'advisor',
      name: 'Fizzle',
      x: 180,
      y: 180,
      spriteIndex: 1,
      dialog: [
        "I'm Fizzle, the royal advisor and squirrel mage.",
        "I've had WAY too much coffee today! *twitches*",
        "The Jellyblade is our kingdom's most powerful artifact.",
        "Without it, the Snack Lords will turn everything into food!"
      ]
    },
    {
      id: 'knight',
      name: 'Sir Crumb',
      x: 320,
      y: 180,
      spriteIndex: 2,
      dialog: [
        "I am Sir Crumb, knight of the realm.",
        "*a piece of his bread arm falls off*",
        "Don't mind that. Happens all the time.",
        "I'll accompany you on your quest, if you'll have me."
      ]
    }
  ];

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = '/background.png';
    
    const charactersImage = new Image();
    charactersImage.src = '/characters.png';
    
    const playerImage = new Image();
    playerImage.src = '/characters.png';
    
    Promise.all([
      new Promise(resolve => backgroundImage.onload = resolve),
      new Promise(resolve => charactersImage.onload = resolve),
      new Promise(resolve => playerImage.onload = resolve)
    ]).then(() => {
      drawScene(backgroundImage, charactersImage, playerImage);
    });
    
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
      
      const moveSpeed = 5;

      switch (e.code) {
        case 'ArrowUp':
          newY -= moveSpeed;
          newDirection = 'up';
          break;
        case 'ArrowDown':
          newY += moveSpeed;
          newDirection = 'down';
          break;
        case 'ArrowLeft':
          newX -= moveSpeed;
          newDirection = 'left';
          break;
        case 'ArrowRight':
          newX += moveSpeed;
          newDirection = 'right';
          break;
        case 'Space':
          handleInteraction();
          break;
      }
      
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > 480) newX = 480;
      if (newY > 400) newY = 400;
      
      const characterCollision = characters.some(
        char => Math.abs(char.x - newX) < 30 && Math.abs(char.y - newY) < 30
      );
      
      if (!characterCollision) {
        setPlayerPosition({ x: newX, y: newY });
      }
      
      setFacingDirection(newDirection);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, facingDirection, showDialog]);

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = '/background.png';
    
    const charactersImage = new Image();
    charactersImage.src = '/characters.png';
    
    const playerImage = new Image();
    playerImage.src = '/characters.png';
    
    if (backgroundImage.complete && charactersImage.complete && playerImage.complete) {
      drawScene(backgroundImage, charactersImage, playerImage);
    }
  }, [playerPosition, facingDirection]);

  const drawScene = (backgroundImg: HTMLImageElement, charactersImg: HTMLImageElement, playerImg: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    characters.forEach(character => {
      const spriteSize = 16;
      const spriteX = (character.spriteIndex % 4) * spriteSize;
      const spriteY = Math.floor(character.spriteIndex / 4) * spriteSize;
      
      ctx.drawImage(
        charactersImg,
        spriteX, spriteY, spriteSize, spriteSize,
        character.x - 16, character.y - 16, 32, 32
      );
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(character.name, character.x, character.y - 20);
    });
    
    const directionIndex = {
      down: 0,
      left: 1,
      right: 2,
      up: 3
    };
    
    const spriteSize = 16;
    const spriteX = 0; // First column in sprite sheet
    const spriteY = directionIndex[facingDirection] * spriteSize;
    
    ctx.drawImage(
      playerImg,
      spriteX, spriteY, spriteSize, spriteSize,
      playerPosition.x - 16, playerPosition.y - 16, 32, 32
    );
  };

  const handleInteraction = () => {
    const interactDistance = 40;
    
    const interactX = playerPosition.x + (facingDirection === 'right' ? 30 : facingDirection === 'left' ? -30 : 0);
    const interactY = playerPosition.y + (facingDirection === 'down' ? 30 : facingDirection === 'up' ? -30 : 0);
    
    let closestCharacter: Character | null = null;
    let closestDistance = interactDistance;
    
    characters.forEach(character => {
      const distance = Math.sqrt(
        Math.pow(character.x - interactX, 2) + 
        Math.pow(character.y - interactY, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCharacter = character;
      }
    });
    
    if (closestCharacter) {
      setActiveCharacter(closestCharacter);
      setDialogIndex(0);
      setShowDialog(true);
    }
    
    if (playerPosition.y > 380 && onExitRoom) {
      onExitRoom();
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

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={400}
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
          <p>Go to the bottom of the screen to exit</p>
        </div>
      </motion.div>
    </div>
  );
}
