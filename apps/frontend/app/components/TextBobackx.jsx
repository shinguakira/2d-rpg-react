import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { gameEngine } from "~/lib/gameEngine";

import { 
  dialogTextAtom, 
  isDialogVisibleAtom, 
  dialogMessagesAtom,
  dialogIndexAtom
} from "~/lib/store";
import "../index.css";

const variants = {
  open: { opacity: 1, scale: 1 },
  closed: { opacity: 0, scale: 0.5 },
};

export default function TextBox() {
  const [isVisible, setIsVisible] = useAtom(isDialogVisibleAtom);
  const [isCloseRequest, setIsCloseRequest] = useState(false);
  const content = useAtomValue(dialogTextAtom);
  const [dialogMessages] = useAtom(dialogMessagesAtom);
  const [dialogIndex] = useAtom(dialogIndexAtom);
  
  // Determine if this is the last message
  const isLastMessage = dialogMessages.length > 0 && dialogIndex === dialogMessages.length - 1;

  const handleAnimationComplete = () => {
    if (isCloseRequest) {
      setIsVisible(false);
      setIsCloseRequest(false);
      // Ensure game engine dialog is also closed
      gameEngine.closeDialog();
    }
  };

  // Function to force close the dialog
  const closeDialog = () => {
    setIsCloseRequest(true);
  };

  // Listen for Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;
      
      // Close dialog on Escape key
      if (e.code === "Escape") {
        closeDialog();
        e.preventDefault();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  // Close dialog if content becomes null
  useEffect(() => {
    if (isVisible && !content) {
      closeDialog();
    }
  }, [isVisible, content]);

  if (!isVisible || !content) return null;

  return (
    <motion.div
      className="text-box"
      style={{
        position: "absolute",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "800px",
        height: "150px",
        backgroundColor: "black",
        borderRadius: "0px",
        padding: "16px 24px",
        fontFamily: '"gameboy", monospace',
        letterSpacing: "2px",
        lineHeight: "1.2",
        border: "none",
        boxShadow: "0 0 0 4px white, 0 0 0 6px black",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isCloseRequest ? "closed" : "open"}
      variants={variants}
      transition={{ duration: 0.2 }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div>
        <p
          style={{
            fontSize: "24px",
            color: "white",
            margin: "0",
            padding: "0",
            textTransform: "uppercase",
            textAlign: "left",
            textShadow: "none",
            fontFamily: '"gameboy", monospace',
            letterSpacing: "2px",
            wordSpacing: "8px",
          }}
        >
          {content}
        </p>
      </div>
      
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px"
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "gray",
            margin: "0",
            padding: "0",
          }}
        >
          {isLastMessage 
            ? "Press any key to end conversation" 
            : "Press any key to continue"}
        </p>
        
        {dialogMessages.length > 0 && (
          <p
            style={{
              fontSize: "14px",
              color: "gray",
              margin: "0",
              padding: "0",
            }}
          >
            {dialogIndex + 1}/{dialogMessages.length}
          </p>
        )}
      </div>
    </motion.div>
  );
}
