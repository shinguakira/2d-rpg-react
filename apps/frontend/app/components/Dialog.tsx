import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { dialogTextAtom, isDialogVisibleAtom } from '~/lib/store';

const variants = {
  open: { opacity: 1, scale: 1, y: 0 },
  closed: { opacity: 0, scale: 0.8, y: 20 },
};

export default function Dialog() {
  const [isDialogVisible, setIsDialogVisible] = useAtom(isDialogVisibleAtom);
  const dialogText = useAtomValue(dialogTextAtom);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && dialogText && isDialogVisible) {
        setIsClosing(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogText, isDialogVisible]);

  const handleAnimationComplete = () => {
    if (isClosing) {
      setIsDialogVisible(false);
      setIsClosing(false);
    }
  };

  if (!dialogText || !isDialogVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-black/90 text-white py-6 px-8 border-t-4 border-gray-700"
        style={{
          fontFamily: 'monospace',
          height: '180px',
          imageRendering: 'pixelated',
        }}
        initial="closed"
        animate={isClosing ? 'closed' : 'open'}
        variants={variants}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <p className="text-2xl mb-4" style={{ letterSpacing: '0.05em' }}>{dialogText}</p>
        <p className="text-sm text-gray-400 mt-2">Press Space to continue</p>
      </motion.div>
    </AnimatePresence>
  );
}
