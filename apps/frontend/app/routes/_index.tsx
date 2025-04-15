import type { MetaFunction } from '@remix-run/node';
import GameCanvas from '~/components/GameCanvas';

export const meta: MetaFunction = () => {
  return [
    { title: '2D RPG Game' },
    { name: 'description', content: 'A 2D RPG game built with Remix' },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">2D RPG Game</h1>
        <GameCanvas width={960} height={720} />
        <div className="mt-4 text-gray-400 text-center">
          <p>Use arrow keys to move</p>
          <p>Approach NPCs and press Space to interact</p>
        </div>
      </div>
    </div>
  );
}
