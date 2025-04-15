import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogProps {
  text: string | null;
  onClose: () => void;
}

const variants = {
  open: { opacity: 1, scale: 1, y: 0 },
  closed: { opacity: 0, scale: 0.8, y: 20 },
};

export default function Dialog({ text, onClose }: DialogProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && text) {
        setIsClosing(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text]);

  const handleAnimationComplete = () => {
    if (isClosing) {
      onClose();
      setIsClosing(false);
    }
  };

  if (!text) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4"
        initial="closed"
        animate={isClosing ? 'closed' : 'open'}
        variants={variants}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <p className="text-lg">{text}</p>
        <p className="text-sm text-gray-400 mt-2">Press Space to continue</p>
      </motion.div>
    </AnimatePresence>
  );
}
