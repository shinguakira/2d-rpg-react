import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TitlePageProps {
  onStartGame: () => void;
}

export default function TitlePage({ onStartGame }: TitlePageProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartGame();
    }, 1000);
  };

  // Add keyboard shortcut to start game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Floating elements */}
        <motion.div
          className="absolute w-16 h-16 bg-yellow-300 rounded-full opacity-70"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '20%', left: '15%' }}
        />
        <motion.div
          className="absolute w-12 h-12 bg-green-400 rounded-full opacity-70"
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '60%', right: '20%' }}
        />
        <motion.div
          className="absolute w-10 h-10 bg-blue-300 rounded-full opacity-70"
          animate={{
            x: [0, 25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '25%', left: '25%' }}
        />
      </div>

      {/* Main content container */}
      <motion.div
        className="relative z-10 max-w-4xl w-full flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Pudding Quest
          </motion.h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            The Jellyblade Chronicles
          </h2>
        </motion.div>
        
        {/* Character */}
        <motion.div
          className="relative w-64 h-64 mx-auto my-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className="w-full h-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/peppin.svg')" }}
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/jellyseed.svg')" }}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Story snippet */}
        <motion.p 
          className="text-white max-w-md mx-auto mb-8 text-center text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          In the colorful kingdom of Syralune, the Jellyblade has been accidentally eaten by the gluttonous slime-king Gloopius! 
          Join Peppin and friends to save the kingdom from the mischievous Snack Lords.
        </motion.p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <motion.button
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full text-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            animate={isAnimating ? { scale: [1, 0], opacity: [1, 0] } : {}}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Begin Adventure!
          </motion.button>
          
          <motion.button
            className="px-6 py-2 bg-transparent border-2 border-white text-white font-semibold rounded-full text-lg hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowControls(!showControls)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </motion.button>
        </div>

        {/* Controls */}
        {showControls && (
          <motion.div 
            className="mt-6 p-4 bg-black/50 rounded-lg text-white max-w-md w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-xl font-bold mb-2">Game Controls</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Arrow keys: Move character</li>
              <li>Space: Interact / Continue dialog</li>
              <li>F: Toggle fullscreen</li>
              <li>ESC: Pause game</li>
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-4 text-white/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Press SPACE or ENTER to begin
      </motion.div>
    </div>
  );
}
