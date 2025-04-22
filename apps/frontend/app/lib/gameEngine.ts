import { store, keyBindingsAtom, KeyBindings, isDebugModeAtom } from '~/lib/store';
import { levelOneMap, castleMap, castleFloorMap } from './mapData';

export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 'up' | 'down' | 'left' | 'right';
  animation: 'idle' | 'walk';
}

// Define map tile types
export type TileType = 'floor' | 'wall' | 'water' | 'tree' | 'castle' | 'overworld' | 'castleFloor';

// Define collision map interface
export interface CollisionMap {
  width: number;
  height: number;
  tileSize: number;
  tiles: TileType[][];
}

export interface GameState {
  player: Sprite;
  npcs: Sprite[];
  dialogText: string | null;
  dialogMessages: string[];
  dialogIndex: number;
  isInDialog: boolean;
  gameTime: number;
  map: CollisionMap;
}

class GameEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private gameState: GameState = {
    player: {
      x: 1100,
      y: 1100,
      width: 80,
      height: 80,
      direction: 'down',
      animation: 'idle',
    },
    npcs: [],
    dialogText: null,
    dialogMessages: [],
    dialogIndex: 0,
    isInDialog: false,
    gameTime: Date.now(),
    map: {
      width: levelOneMap[0].length,
      height: levelOneMap.length,
      tileSize: 80,
      tiles: levelOneMap,
    }
  };

  private keyState: Record<string, boolean> = {};
  private lastTimestamp: number = 0;
  private readonly PLAYER_SPEED = 200;
  private keyBindings: KeyBindings;

  // Sprite resources
  private backgroundImage: HTMLImageElement | null = null;
  private castleBackgroundImage: HTMLImageElement | null = null;
  private castleFloorBackgroundImage: HTMLImageElement | null = null;
  private charactersImage: HTMLImageElement | null = null;
  private tilesImage: HTMLImageElement | null = null;
  private spriteFrames: Record<string, { x: number; y: number }> = {
    'down-idle': { x: 0, y: 0 },
    'up-idle': { x: 1, y: 0 },
    'right-idle': { x: 2, y: 0 },
    'left-idle': { x: 3, y: 0 },
    'right-walk': { x: 4, y: 0 },
    'left-walk': { x: 6, y: 0 },
    'down-walk': { x: 0, y: 1 },
    'up-walk': { x: 2, y: 1 },
    'npc-down': { x: 4, y: 1 },
    'npc-up': { x: 5, y: 1 },
    'npc-right': { x: 6, y: 1 },
    'npc-left': { x: 7, y: 1 },
  };

  constructor() {
    // Initialize with default keybindings
    this.keyBindings = store.get(keyBindingsAtom);
    
    // Subscribe to keybinding changes
    store.sub(keyBindingsAtom, () => {
      this.keyBindings = store.get(keyBindingsAtom);
      console.log('Keybindings updated:', this.keyBindings);
    });
  }

  // Generate a simple map with walls around the edges and some obstacles
  private generateMap(width: number, height: number): TileType[][] {
    const map: TileType[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < width; x++) {
        // Create walls around the edges
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          row.push('wall');
        } 
        // Add some random obstacles
        else if (Math.random() < 0.1) {
          const obstacleType = Math.random() < 0.5 ? 'tree' : 'water';
          row.push(obstacleType);
        } 
        // The rest is floor
        else {
          row.push('floor');
        }
      }
      map.push(row);
    }
    
    // Ensure the player starting position is clear
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    
    // Clear a 3x3 area around the player starting position
    for (let y = centerY - 1; y <= centerY + 1; y++) {
      for (let x = centerX - 1; x <= centerX + 1; x++) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          map[y][x] = 'floor';
        }
      }
    }
    
    return map;
  }

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupEventListeners();
    this.loadResources();
    this.addNPC();
    this.addNPC(100, 100);
    this.addNPC(150, 150);
    
    // Set player position to center of map
    const centerX = Math.floor(this.gameState.map.width / 2) * this.gameState.map.tileSize;
    const centerY = Math.floor(this.gameState.map.height / 2) * this.gameState.map.tileSize;
    this.gameState.player.x = centerX;
    this.gameState.player.y = centerY;
    
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private loadResources() {
    // Load character sprites
    this.charactersImage = new Image();
    this.charactersImage.src = '/characters.png';
    
    // Load tile sprites
    this.tilesImage = new Image();
    this.tilesImage.src = '/tiles.png';
    
    // Load background images
    this.backgroundImage = new Image();
    this.backgroundImage.src = '/background.png';
    
    this.castleBackgroundImage = new Image();
    this.castleBackgroundImage.src = '/maps/castle.png';
    
    this.castleFloorBackgroundImage = new Image();
    this.castleFloorBackgroundImage.src = '/maps/castleFloor.png';
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Store key state
      this.keyState[e.key] = true;
      
      // Handle dialog advancement on any key press except Escape
      if (this.gameState.isInDialog && e.key !== 'Escape') {
        // Prevent default to avoid scrolling with space or arrows
        e.preventDefault();
        
        // Advance dialog or close if on last message
        this.advanceDialog();
      }
      
      // Handle Escape key to close dialog immediately
      if (this.gameState.isInDialog && e.key === 'Escape') {
        this.closeDialog();
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keyState[e.key] = false;
    });
  }

  private addNPC(x: number = 600, y: number = 300) {
    this.gameState.npcs.push({
      x,
      y,
      width: 64,
      height: 64,
      direction: 'left',
      animation: 'idle',
    });
  }

  // Check if a position would collide with a wall or obstacle
  private checkCollision(x: number, y: number): boolean {
    if (!this.ctx) return true; // Prevent movement if context is not available
    
    const { map } = this.gameState;
    const tileSize = map.tileSize;
    
    // Convert pixel position to tile coordinates
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);
    
    // Check if out of bounds
    if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
      return true;
    }
    
    // Check if the tile is a wall or other obstacle
    const tile = map.tiles[tileY][tileX];
    return tile === 'wall' || tile === 'water' || tile === 'tree';
  }

  private updatePlayer(deltaTime: number) {
    // Don't allow player movement during dialog
    if (this.gameState.isInDialog) return;
    
    const { player, map } = this.gameState;
    const speed = this.PLAYER_SPEED * deltaTime;
    let dx = 0;
    let dy = 0;
    let isMoving = false;
    
    // Check key states for movement
    if (this.isKeyPressed(this.keyBindings.up)) {
      dy = -speed;
      player.direction = 'up';
      isMoving = true;
    } else if (this.isKeyPressed(this.keyBindings.down)) {
      dy = speed;
      player.direction = 'down';
      isMoving = true;
    }
    
    if (this.isKeyPressed(this.keyBindings.left)) {
      dx = -speed;
      player.direction = 'left';
      isMoving = true;
    } else if (this.isKeyPressed(this.keyBindings.right)) {
      dx = speed;
      player.direction = 'right';
      isMoving = true;
    }
    
    // Update animation state
    player.animation = isMoving ? 'walk' : 'idle';
    
    // Apply movement if no collision
    if (dx !== 0 && !this.checkCollision(player.x + dx, player.y)) {
      player.x += dx;
    }
    
    if (dy !== 0 && !this.checkCollision(player.x, player.y + dy)) {
      player.y += dy;
    }
    
    // Check for map transitions
    this.checkMapTransition(player.x, player.y);
    
    // Check for NPC interactions when interact key is pressed
    if (this.isKeyPressed(this.keyBindings.interact)) {
      this.checkNPCInteractions();
    }
  }

  // Check if player is on a path tile that should trigger a map transition
  private checkMapTransition(x: number, y: number) {
    const { map } = this.gameState;
    const tileSize = map.tileSize;
    
    // Convert pixel coordinates to tile coordinates
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);
    
    // Check if position is inside the map
    if (tileX >= 0 && tileX < map.width && tileY >= 0 && tileY < map.height) {
      // Check if the tile is a path
      const tile = map.tiles[tileY][tileX];
      
      if (tile === 'castle') {
        // From overworld, can only go to castle
        this.switchMap('castle');
      } else if (tile === 'overworld') {
        // From castle, can go to overworld
        this.switchMap('overworld');
      } else if (tile === 'castleFloor') {
        // From castle, can go to castle floor
        this.switchMap('castleFloor');
      }
    }
  }

  private checkNPCInteractions() {
    const player = this.gameState.player;

    for (const npc of this.gameState.npcs) {
      const dx = player.x - npc.x;
      const dy = player.y - npc.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        // Update NPC direction to face player
        if (Math.abs(dx) > Math.abs(dy)) {
          npc.direction = dx > 0 ? 'right' : 'left';
        } else {
          npc.direction = dy > 0 ? 'down' : 'up';
        }

        // Check for interaction key (Space or Enter)
        if (this.keyBindings.interact.some((key: string) => this.keyState[key]) && !this.gameState.isInDialog) {
          // Start dialog based on player approach direction
          let dialogMessages: string[] = [];
          
          if (player.direction === 'up') {
            dialogMessages = [
              "Beautiful day, isn't it?",
              "I've been enjoying the sunshine all day.",
              "Hope you're having a wonderful adventure!"
            ];
          } else if (player.direction === 'down') {
            dialogMessages = [
              "Welcome to the game!",
              "I'm so glad you're here.",
              "There's so much to explore in this world."
            ];
          } else if (player.direction === 'left') {
            dialogMessages = [
              "Press Space or Enter to continue this dialog.",
              "You can press Escape to skip the conversation.",
              "Dialog will close when we're done talking."
            ];
          } else {
            dialogMessages = [
              "This game is built with Remix!",
              "We're using React and TypeScript.",
              "The state is managed with Jotai atoms."
            ];
          }
          
          this.startDialog(dialogMessages);
          
          // Reset key state to prevent immediate advancement
          this.keyBindings.interact.forEach((key: string) => {
            this.keyState[key] = false;
          });
        }
      }
    }
  }

  private startDialog(messages: string[]) {
    if (messages.length === 0) return;
    
    this.gameState.dialogMessages = messages;
    this.gameState.dialogIndex = 0;
    this.gameState.dialogText = messages[0];
    this.gameState.isInDialog = true;
  }

  private advanceDialog() {
    const { dialogMessages, dialogIndex } = this.gameState;
    
    if (dialogIndex < dialogMessages.length - 1) {
      // Move to next message
      this.gameState.dialogIndex++;
      this.gameState.dialogText = dialogMessages[this.gameState.dialogIndex];
      console.log(`Advanced to message ${this.gameState.dialogIndex + 1}/${dialogMessages.length}`);
    } else {
      // End of dialog when on the last message
      console.log('Closing dialog from advanceDialog');
      this.closeDialog();
    }
  }

  private drawSprite(sprite: Sprite, isNPC: boolean = false) {
    if (!this.ctx || !this.charactersImage) return;

    const frameKey = isNPC ? `npc-${sprite.direction}` : `${sprite.direction}-${sprite.animation}`;

    const frame = this.spriteFrames[frameKey];
    if (!frame) return;

    const SPRITE_WIDTH = 16;
    const SPRITE_HEIGHT = 16;
    const SCALE = 4;

    this.ctx.drawImage(
      this.charactersImage,
      frame.x * SPRITE_WIDTH,
      frame.y * SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      sprite.x - (SPRITE_WIDTH * SCALE) / 2,
      sprite.y - (SPRITE_HEIGHT * SCALE) / 2,
      SPRITE_WIDTH * SCALE,
      SPRITE_HEIGHT * SCALE
    );
  }
  
  private drawMap() {
    if (!this.ctx || !this.canvas) return;
    
    const { map } = this.gameState;
    const tileSize = map.tileSize;
    
    // Calculate visible area based on player position
    const playerX = this.gameState.player.x;
    const playerY = this.gameState.player.y;
    
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    // Calculate the visible tile range
    const startTileX = Math.max(0, Math.floor((playerX - canvasWidth / 2) / tileSize));
    const endTileX = Math.min(map.width - 1, Math.ceil((playerX + canvasWidth / 2) / tileSize));
    const startTileY = Math.max(0, Math.floor((playerY - canvasHeight / 2) / tileSize));
    const endTileY = Math.min(map.height - 1, Math.ceil((playerY + canvasHeight / 2) / tileSize));
    
    // Get current time for animation
    const time = Date.now();
    
    // Draw visible tiles
    for (let y = startTileY; y <= endTileY; y++) {
      for (let x = startTileX; x <= endTileX; x++) {
        const tile = map.tiles[y][x];
        
        // Set tile color based on type
        switch (tile) {
          case 'floor':
            this.ctx.fillStyle = '#7CFC00'; // Light green for grass
            break;
          case 'wall':
            this.ctx.fillStyle = '#808080'; // Gray for walls
            break;
          case 'water':
            this.ctx.fillStyle = '#1E90FF'; // Blue for water
            break;
          case 'tree':
            this.ctx.fillStyle = '#228B22'; // Forest green for trees
            break;
          case 'castle':
            this.ctx.fillStyle = '#FFA07A'; // Light salmon for castle
            break;
          case 'overworld':
            this.ctx.fillStyle = '#6495ED'; // Sky blue for overworld
            break;
          case 'castleFloor':
            this.ctx.fillStyle = '#FFC080'; // Light coral for castle floor
            break;
        }
        
        // Draw the tile
        this.ctx.fillRect(
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
        
        // Add a border to make tiles more visible
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }

  // Method to switch maps
  switchMap(mapType: 'overworld' | 'castle' | 'castleFloor') {
    // Store the current position before switching maps
    const currentX = this.gameState.player.x;
    const currentY = this.gameState.player.y;
    const currentTileX = Math.floor(currentX / this.gameState.map.tileSize);
    const currentTileY = Math.floor(currentY / this.gameState.map.tileSize);
    
    // Get current map dimensions
    const oldMapWidth = this.gameState.map.width;
    const oldMapHeight = this.gameState.map.height;
    
    // Switch to the new map
    if (mapType === 'overworld') {
      this.gameState.map = {
        width: levelOneMap[0].length,
        height: levelOneMap.length,
        tileSize: 80,
        tiles: levelOneMap,
      };
    } else if (mapType === 'castle') {
      this.gameState.map = {
        width: castleMap[0].length,
        height: castleMap.length,
        tileSize: 120,
        tiles: castleMap,
      };
    } else if (mapType === 'castleFloor') {
      this.gameState.map = {
        width: castleFloorMap[0].length,
        height: castleFloorMap.length,
        tileSize: 120,
        tiles: castleFloorMap,
      };
    }
    
    // Calculate the relative position in the new map
    // This preserves the player's position relative to the map size
    const relativeX = currentTileX / oldMapWidth;
    const relativeY = currentTileY / oldMapHeight;
    
    const newTileX = Math.floor(relativeX * this.gameState.map.width);
    const newTileY = Math.floor(relativeY * this.gameState.map.height);
    
    // Set the player position in the new map
    this.gameState.player.x = (newTileX + 0.5) * this.gameState.map.tileSize;
    this.gameState.player.y = (newTileY + 0.5) * this.gameState.map.tileSize;
    
    console.log(`Map transition: Player moved from (${currentTileX},${currentTileY}) to (${newTileX},${newTileY})`);
  }

  private render() {
    if (!this.ctx || !this.canvas) return;
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Determine which background to use based on the current map
    let currentBackground = this.backgroundImage;
    let mapName = 'overworld';
    let backgroundFile = '/background.png';
    
    if (this.gameState.map.tiles === castleMap) {
      currentBackground = this.castleBackgroundImage;
      mapName = 'castle';
      backgroundFile = '/maps/castle.png';
    } else if (this.gameState.map.tiles === castleFloorMap) {
      currentBackground = this.castleFloorBackgroundImage;
      mapName = 'castleFloor';
      backgroundFile = '/maps/castleFloor.png';
    }
    
    // Log current map and background file
    console.log(`Current Map: ${mapName}, Background: ${backgroundFile}`);
    
    // Draw background image if loaded
    if (currentBackground && currentBackground.complete) {
      // Draw a single background image that covers the entire screen
      this.ctx.drawImage(currentBackground, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Get debug mode status
    const isDebugMode = store.get(isDebugModeAtom);
    
    // In debug mode, draw all map tiles
    if (isDebugMode) {
      this.drawMap();
    } 
    // In normal mode, only highlight path tiles
    else {
      this.highlightPathTiles();
    }

    // Draw NPCs
    for (const npc of this.gameState.npcs) {
      this.drawSprite(npc, true);
    }

    // Draw player
    this.drawSprite(this.gameState.player);
  }
  
  // Method to only highlight path tiles (for normal mode)
  private highlightPathTiles() {
    if (!this.ctx || !this.canvas) return;
    
    const { map } = this.gameState;
    const tileSize = map.tileSize;
    
    // Calculate visible area based on player position
    const playerX = this.gameState.player.x;
    const playerY = this.gameState.player.y;
    
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    // Calculate the visible tile range
    const startTileX = Math.max(0, Math.floor((playerX - canvasWidth / 2) / tileSize));
    const endTileX = Math.min(map.width - 1, Math.ceil((playerX + canvasWidth / 2) / tileSize));
    const startTileY = Math.max(0, Math.floor((playerY - canvasHeight / 2) / tileSize));
    const endTileY = Math.min(map.height - 1, Math.ceil((playerY + canvasHeight / 2) / tileSize));
    
    // Get current time for animation
    const time = Date.now();
    
    // Draw only path tiles
    for (let y = startTileY; y <= endTileY; y++) {
      for (let x = startTileX; x <= endTileX; x++) {
        const tile = map.tiles[y][x];
        
        // Only process path tiles
        if (tile === 'castle' || tile === 'overworld' || tile === 'castleFloor') {
          // Create a pulsing effect for path tiles
          const pulseValue = Math.sin(time / 200) * 0.5 + 0.5; // Value between 0 and 1
          const alpha = 0.7 * pulseValue; // Semi-transparent
          
          // Draw a glowing circle for path tiles
          this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.arc(
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            tileSize / 3,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
          
          // Add a subtle arrow pointing down
          this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(x * tileSize + tileSize / 2, y * tileSize + tileSize / 4);
          this.ctx.lineTo(x * tileSize + tileSize / 4, y * tileSize + tileSize / 2);
          this.ctx.lineTo(x * tileSize + 3 * tileSize / 4, y * tileSize + tileSize / 2);
          this.ctx.closePath();
          this.ctx.fill();
        }
      }
    }
  }

  private gameLoop(timestamp: number) {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.updatePlayer(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  getGameState(): GameState {
    return this.gameState;
  }

  closeDialog() {
    console.log('Closing dialog');
    // Clear all dialog state
    this.gameState.dialogText = null;
    this.gameState.dialogMessages = [];
    this.gameState.dialogIndex = 0;
    this.gameState.isInDialog = false;
    
    // Add a small delay to prevent immediate re-opening of dialog
    this.keyBindings.interact.forEach((key: string) => {
      this.keyState[key] = false;
    });
  }

  private isKeyPressed(keys: string[]) {
    return keys.some((key: string) => this.keyState[key]);
  }
}

export const gameEngine = new GameEngine();
