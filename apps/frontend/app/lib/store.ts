import { atom, createStore } from 'jotai';

// Dialog system atoms
export const dialogTextAtom = atom<string | null>(null);
export const dialogMessagesAtom = atom<string[]>([]);
export const dialogIndexAtom = atom<number>(0);
export const isDialogVisibleAtom = atom<boolean>(false);

// Game state atoms
export const gameTimeAtom = atom<number>(Date.now());
export const playerPositionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
export const playerDirectionAtom = atom<'up' | 'down' | 'left' | 'right'>('down');

// Settings atoms
export interface KeyBindings {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
  interact: string[];
}

export const defaultKeyBindings: KeyBindings = {
  up: ['ArrowUp', 'w', 'W'],
  down: ['ArrowDown', 's', 'S'],
  left: ['ArrowLeft', 'a', 'A'],
  right: ['ArrowRight', 'd', 'D'],
  interact: [' ', 'Enter']
};

export const keyBindingsAtom = atom<KeyBindings>(defaultKeyBindings);
export const isSettingsOpenAtom = atom<boolean>(false);

// Derived atom for current dialog message
export const currentDialogMessageAtom = atom(
  (get) => {
    const messages = get(dialogMessagesAtom);
    const index = get(dialogIndexAtom);
    return messages.length > 0 ? messages[index] : null;
  }
);

// Create the store
export const store = createStore();
