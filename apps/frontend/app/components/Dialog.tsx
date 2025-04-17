import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { dialogTextAtom, isDialogVisibleAtom } from '~/lib/store';

const variants = {
  open: { opacity: 1, scale: 1 },
  closed: { opacity: 0, scale: 0.5 },
};

export default function Dialog() {
  const [isDialogVisible, setIsDialogVisible] = useAtom(isDialogVisibleAtom);
  const dialogText = useAtomValue(dialogTextAtom);
  const [isClosing, setIsClosing] = useState(false);
  console.log("Dialog rendering - isVisible:", isDialogVisible, "content:", dialogText);

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
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-game min-h-[200px] bg-black/90 p-8 font-gameboy flex flex-col justify-center rounded-lg border border-font-color/20 z-50"
        style={{ 
          width: 'calc(min(90%, 1200px))',
          color: 'var(--font-color)',
          zIndex: 50,
          display: isDialogVisible || isClosing ? 'flex' : 'none',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isClosing ? 'closed' : 'open'}
        variants={variants}
        transition={{ duration: 0.2 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <p className="text-2xl leading-relaxed tracking-wider m-0 p-0">{dialogText}</p>
        <p className="text-sm text-gray-400 mt-4 text-right">Press Space to continue</p>
      </motion.div>
    </AnimatePresence>
  );
}
