export interface MapTile {
  type: 'floor' | 'wall' | 'carpet' | 'throne' | 'table' | 'bookshelf' | 'torch' | 'window' | 'banner' | 'door';
  walkable: boolean;
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  spriteIndex: number;
  dialog: string[];
}

export interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: MapTile[];
  characters: Character[];
}

export const castleMap: GameMap = {
  id: 'castle_throne_room',
  name: 'Castle Throne Room',
  width: 15,
  height: 15,
  tiles: [
    ...Array.from({ length: 15 * 15 }, (_, i) => ({
      type: 'floor' as const,
      walkable: true,
      x: i % 15,
      y: Math.floor(i / 15),
    })),
    
    ...Array.from({ length: 3 * 8 }, (_, i) => ({
      type: 'carpet' as const,
      walkable: true,
      x: 6 + (i % 3),
      y: 4 + Math.floor(i / 3),
    })),
    
    {
      type: 'throne' as const,
      walkable: false,
      x: 7,
      y: 3,
    },
    
    {
      type: 'bookshelf' as const,
      walkable: false,
      x: 2,
      y: 3,
    },
    
    {
      type: 'table' as const,
      walkable: false,
      x: 12,
      y: 3,
    },
    
    {
      type: 'window' as const,
      walkable: false,
      x: 3,
      y: 2,
    },
    {
      type: 'window' as const,
      walkable: false,
      x: 11,
      y: 2,
    },
    
    {
      type: 'banner' as const,
      walkable: false,
      x: 5,
      y: 2,
    },
    {
      type: 'banner' as const,
      walkable: false,
      x: 9,
      y: 2,
    },
    
    {
      type: 'torch' as const,
      walkable: false,
      x: 2,
      y: 2,
    },
    {
      type: 'torch' as const,
      walkable: false,
      x: 12,
      y: 2,
    },
    {
      type: 'torch' as const,
      walkable: false,
      x: 2,
      y: 8,
    },
    {
      type: 'torch' as const,
      walkable: false,
      x: 12,
      y: 8,
    },
    
    {
      type: 'door' as const,
      walkable: true,
      x: 7,
      y: 12,
    },
  ],
  characters: [
    {
      id: 'king',
      name: 'King Gloopius',
      role: 'ruler',
      x: 7,
      y: 3,
      direction: 'down',
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
      role: 'advisor',
      x: 5,
      y: 5,
      direction: 'right',
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
      role: 'knight',
      x: 9,
      y: 5,
      direction: 'left',
      spriteIndex: 2,
      dialog: [
        "I am Sir Crumb, knight of the realm.",
        "*a piece of his bread arm falls off*",
        "Don't mind that. Happens all the time.",
        "I'll accompany you on your quest, if you'll have me."
      ]
    },
    {
      id: 'guard1',
      name: 'Guard',
      role: 'guard',
      x: 4,
      y: 8,
      direction: 'right',
      spriteIndex: 3,
      dialog: [
        "Halt! Oh, you're the new hero everyone's talking about.",
        "Be careful out there. The Pudding Forest is particularly dangerous this time of year.",
        "The custard wolves are in their mating season."
      ]
    },
    {
      id: 'guard2',
      name: 'Guard',
      role: 'guard',
      x: 10,
      y: 8,
      direction: 'left',
      spriteIndex: 3,
      dialog: [
        "Welcome to the castle, adventurer.",
        "I heard the king has a special mission for you.",
        "Something about a jellied sword? I wasn't really paying attention."
      ]
    },
    {
      id: 'player',
      name: 'Peppin',
      role: 'hero',
      x: 7,
      y: 10,
      direction: 'up',
      spriteIndex: 4,
      dialog: []
    }
  ]
};
