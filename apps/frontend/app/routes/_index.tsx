import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import GameCanvas from '../components/GameCanvas';
import TitlePage from '../components/TitlePage';

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
        <div onClick={handleStartGame}>
          <TitlePage />
        </div>
      ) : (
        <div className="w-full h-screen overflow-hidden bg-black">
          <GameCanvas width={1920} height={1080} />
        </div>
      )}
    </>
  );
}
