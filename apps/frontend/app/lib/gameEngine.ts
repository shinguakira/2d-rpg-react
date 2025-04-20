import { store, keyBindingsAtom, KeyBindings } from './store';

export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 'up' | 'down' | 'left' | 'right';
  animation: 'idle' | 'walk';
}

export interface GameState {
  player: Sprite;
  npcs: Sprite[];
  dialogText: string | null;
  dialogMessages: string[];
  dialogIndex: number;
  isInDialog: boolean;
  gameTime: number;
}

class GameEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private gameState: GameState = {
    player: {
      x: 400,
      y: 300,
      width: 64,
      height: 64,
      direction: 'down',
      animation: 'idle',
    },
    npcs: [],
    dialogText: null,
    dialogMessages: [],
    dialogIndex: 0,
    isInDialog: false,
    gameTime: Date.now(),
  };

  private keyState: { [key: string]: boolean } = {};
  private lastTimestamp: number = 0;
  private readonly PLAYER_SPEED = 200;
  private keyBindings: KeyBindings;

  // Sprite resources
  private backgroundImage: HTMLImageElement | null = null;
  private charactersImage: HTMLImageElement | null = null;
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

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupEventListeners();
    this.loadResources();
    this.addNPC();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private loadResources() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = '/background.png';

    this.charactersImage = new Image();
    this.charactersImage.src = '/characters.png';
  }

  private setupEventListeners() {
    window.addEventListener('keydown', e => {
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

    window.addEventListener('keyup', e => {
      this.keyState[e.key] = false;
    });
  }

  private addNPC() {
    this.gameState.npcs.push({
      x: 600,
      y: 300,
      width: 64,
      height: 64,
      direction: 'left',
      animation: 'idle',
    });
  }

  private updatePlayer(deltaTime: number) {
    // Don't allow player movement during dialog
    if (this.gameState.isInDialog) return;
    
    const player = this.gameState.player;
    let dx = 0;
    let dy = 0;

    // Check if any of the configured keys for each direction are pressed
    if (this.keyBindings.left.some(key => this.keyState[key])) {
      dx -= 1;
      player.direction = 'left';
    }
    if (this.keyBindings.right.some(key => this.keyState[key])) {
      dx += 1;
      player.direction = 'right';
    }
    if (this.keyBindings.up.some(key => this.keyState[key])) {
      dy -= 1;
      player.direction = 'up';
    }
    if (this.keyBindings.down.some(key => this.keyState[key])) {
      dy += 1;
      player.direction = 'down';
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const normalizer = Math.sqrt(2) / 2;
      dx *= normalizer;
      dy *= normalizer;
    }

    // Update position
    player.x += dx * this.PLAYER_SPEED * deltaTime;
    player.y += dy * this.PLAYER_SPEED * deltaTime;

    // Update animation
    player.animation = dx === 0 && dy === 0 ? 'idle' : 'walk';

    // Keep player in bounds
    if (this.canvas) {
      player.x = Math.max(
        player.width / 2,
        Math.min(this.canvas.width - player.width / 2, player.x)
      );
      player.y = Math.max(
        player.height / 2,
        Math.min(this.canvas.height - player.height / 2, player.y)
      );
    }

    // Check NPC interactions
    this.checkNPCInteractions();
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
        if (this.keyBindings.interact.some(key => this.keyState[key]) && !this.gameState.isInDialog) {
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
          this.keyBindings.interact.forEach(key => {
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

  private render() {
    if (!this.ctx || !this.canvas || !this.backgroundImage) return;

    // Draw background
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      -70, // Offset to match react-kaplay positioning
      this.canvas.width,
      this.canvas.height + 70
    );

    // Draw NPCs
    for (const npc of this.gameState.npcs) {
      this.drawSprite(npc, true);
    }

    // Draw player
    this.drawSprite(this.gameState.player);
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
    this.keyBindings.interact.forEach(key => {
      this.keyState[key] = false;
    });
  }
}

export const gameEngine = new GameEngine();
