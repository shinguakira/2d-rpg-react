export interface Vec2 {
  x: number;
  y: number;
  eq: (other: Vec2) => boolean;
}

export interface Sprite {
  pos: Vec2;
  scale: Vec2;
  direction: Vec2;
  speed: number;
  play: (animationName: string) => void;
  getCurAnim: () => { name: string };
  onUpdate: (callback: () => void) => void;
}

export interface KaplayContext {
  vec2: (x: number, y: number) => Vec2;
  isKeyDown: (key: string) => boolean;
  add: (config: any) => Sprite;
  loadSprite: (name: string, config: any) => void;
  scene: string;
  go: (sceneName: string) => void;
}

export interface GameState {
  player: {
    pos: Vec2;
    direction: Vec2;
    currentAnimation: string;
  };
  npcs: Array<{
    pos: Vec2;
    direction: Vec2;
    currentAnimation: string;
  }>;
  scene: string;
}
