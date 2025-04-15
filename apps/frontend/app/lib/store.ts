import { atom, createStore } from 'jotai';

export const dialogTextAtom = atom<string | null>(null);
export const isDialogVisibleAtom = atom<boolean>(false);
export const gameTimeAtom = atom<number>(Date.now());
export const playerPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
export const playerDirectionAtom = atom<'up' | 'down' | 'left' | 'right'>('down');

export const store = createStore();
