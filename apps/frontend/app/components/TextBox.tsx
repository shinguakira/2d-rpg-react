import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { motion } from 'framer-motion';
import { isDialogVisibleAtom, dialogTextAtom } from '~/lib/store';

const variants = {
  open: { opacity: 1, scale: 1 },
  closed: { opacity: 0, scale: 0.5 },
};

export default function TextBox() {
  const [isVisible, setIsVisible] = useAtom(isDialogVisibleAtom);
  const [isCloseRequest, setIsCloseRequest] = useState(false);
  const content = useAtomValue(dialogTextAtom);
  
  console.log("TextBox rendering - isVisible:", isVisible, "content:", content);

  const handleAnimationComplete = () => {
    if (isCloseRequest) {
      setIsVisible(false);
      setIsCloseRequest(false);
    }
  };

  useEffect(() => {
    const closeHandler = (e: KeyboardEvent) => {
      if (!isVisible) return;
      if (e.code === 'Space') {
        setIsCloseRequest(true);
      }
    };

    window.addEventListener('keydown', closeHandler);

    return () => {
      window.removeEventListener('keydown', closeHandler);
    };
  }, [isVisible, setIsVisible]);

  // Always render the component, but control visibility with CSS
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-game min-h-[200px] bg-black/90 p-8 font-gameboy flex flex-col justify-center rounded-lg border border-font-color/20"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isVisible ? 'open' : 'closed'}
      variants={variants}
      transition={{ duration: 0.2 }}
      onAnimationComplete={handleAnimationComplete}
      style={{ 
        display: isVisible || isCloseRequest ? 'flex' : 'none',
        width: 'calc(min(90%, 1200px))',
        color: 'var(--font-color)'
      }}
    >
      <p className="text-2xl leading-relaxed tracking-wider m-0 p-0">{content}</p>
      <p className="text-sm text-gray-400 mt-4 text-right">Press Space to continue</p>
    </motion.div>
  );
}
