interface GameUIProps {
  playerHealth: number;
  score: number;
}

export default function GameUI({ playerHealth, score }: GameUIProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center p-4 bg-black/50 rounded-lg text-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl">❤</span>
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Health</span>
            <span className="font-bold">{playerHealth}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-yellow-500 text-2xl">⭐</span>
        <div className="flex flex-col">
          <span className="text-sm opacity-70">Score</span>
          <span className="font-bold">{score}</span>
        </div>
      </div>
    </div>
  );
}
