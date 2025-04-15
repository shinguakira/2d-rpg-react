import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import GameCanvas from '~/components/GameCanvas';
import TitlePage from '~/components/TitlePage';

export const meta: MetaFunction = () => {
  return [
    { title: 'Pudding Quest: The Jellyblade Chronicles' },
    { name: 'description', content: 'A whimsical 2D RPG game built with Remix' },
  ];
};

export default function Index() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <>
      {!gameStarted ? (
        <TitlePage onStartGame={handleStartGame} />
      ) : (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Pudding Quest</h1>
            <GameCanvas width={960} height={720} />
            <div className="mt-4 text-gray-400 text-center">
              <p>Use arrow keys to move</p>
              <p>Approach NPCs and press Space to interact</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
