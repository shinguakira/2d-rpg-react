import { useState } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

interface TitlePageProps {
  onStartGame: () => void;
}

export default function TitlePage({ onStartGame }: TitlePageProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartGame();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-purple-500 to-pink-400 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Floating food elements */}
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

      {/* Floating islands */}
      <motion.div
        className="absolute w-32 h-16 bg-green-600 rounded-full opacity-90"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '30%', right: '30%' }}
      />
      <motion.div
        className="absolute w-48 h-20 bg-green-700 rounded-full opacity-90"
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '20%', right: '15%' }}
      />

      {/* Title container */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-2 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
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
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white italic drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          The Jellyblade Chronicles
        </h2>
        
        {/* Character */}
        <div className="relative w-64 h-64 mx-auto my-8">
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
        </div>

        {/* Story snippet */}
        <p className="text-white max-w-md mx-auto mb-8 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
          In the colorful kingdom of Syralune, the Jellyblade has been accidentally eaten by the gluttonous slime-king Gloopius! 
          Join Peppin and friends to save the kingdom from the mischievous Snack Lords.
        </p>

        {/* Start button */}
        <motion.button
          className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-full text-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame}
          animate={isAnimating ? { scale: [1, 0], opacity: [1, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          Begin Adventure!
        </motion.button>
      </motion.div>
    </div>
  );
}
