import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@remix-run/react';

export default function TitlePage() {
  const [showStartButton, setShowStartButton] = useState(false);
  
  // Show start button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        window.location.href = '/game';
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Title */}
      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-4 text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          animate={{ 
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 5px rgba(255,255,0,0.3)',
              '0 0 20px rgba(255,255,0,0.7)',
              '0 0 5px rgba(255,255,0,0.3)',
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          Pudding Quest
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-blue-200 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          An Epic 2D RPG Adventure
        </motion.p>
      </motion.div>
      
      {/* Start button */}
      {showStartButton && (
        <motion.div
          className="z-10 mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/game"
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
          >
            Start Game
          </Link>
          <p className="text-gray-400 mt-4 text-sm">Press ENTER or SPACE to start</p>
        </motion.div>
      )}
      
      {/* Footer */}
      <motion.div
        className="absolute bottom-4 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2, duration: 1 }}
      >
        &copy; 2025 Pudding Quest | Made with React & Remix
      </motion.div>
    </div>
  );
}
