import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { motion } from "framer-motion";

import { dialogTextAtom, isDialogVisibleAtom } from "~/lib/store";
import "../index.css";

const variants = {
  open: { opacity: 1, scale: 1 },
  closed: { opacity: 0, scale: 0.5 },
};

export default function TextBox() {
  const [isVisible, setIsVisible] = useAtom(isDialogVisibleAtom);
  const [isCloseRequest, setIsCloseRequest] = useState(false);
  const content = useAtomValue(dialogTextAtom);

  const handleAnimationComplete = () => {
    if (isCloseRequest) {
      setIsVisible(false);
      setIsCloseRequest(false);
    }
  };

  useEffect(() => {
    const closeHandler = (e) => {
      if (!isVisible) return;
      if (e.code === "Space") {
        setIsCloseRequest(true);
      }
    };

    window.addEventListener("keydown", closeHandler);

    return () => {
      window.removeEventListener("keydown", closeHandler);
    };
  }, [isVisible, setIsVisible]);

  return (
    isVisible && (
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
          alignItems: "center",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isCloseRequest ? "closed" : "open"}
        variants={variants}
        transition={{ duration: 0.2 }}
        onAnimationComplete={handleAnimationComplete}
      >
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
      </motion.div>
    )
  );
}
