import { TileType } from './gameEngine';

// Overworld map for 80px tile size (20x15)
export const levelOneMap: TileType[][] = [
  ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'tree', 'tree', 'tree', 'tree', 'tree', 'water', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'tree', 'tree', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'tree', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'water', 'water', 'wall', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'castle', 'castle', 'castle', 'castle', 'castle', 'castle', 'castle', 'castle', 'castle', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'castle', 'castle', 'castle', 'castle', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'castle', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];

// Castle map for 80px tile size (16x12)
export const castleMap: TileType[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'floor', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'wall', 'wall', 'floor', 'floor', 'castleFloor', 'castleFloor', 'floor', 'wall', 'wall', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'overworld', 'overworld', 'overworld', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'floor', 'floor', 'wall', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'wall', 'floor', 'overworld', 'overworld', 'overworld', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall'],
  ['wall', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'overworld', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];

// Castle floor map for 80px tile size (12x10)
export const castleFloorMap: TileType[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'wall', 'floor', 'castle', 'castle', 'castle', 'floor', 'wall', 'floor', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];

// You can add more maps as needed
