import { useAtom } from 'jotai';
import { isDebugModeAtom } from '~/lib/store';
import { useState, useEffect } from 'react';

export default function DebugButton() {
  const [isDebugMode, setIsDebugMode] = useAtom(isDebugModeAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render on server
  }

  return (
    <button
      className="debug-button"
      onClick={() => setIsDebugMode(!isDebugMode)}
      style={{
        position: 'absolute',
        top: '10px',
        right: '80px', // Position to the left of fullscreen button
        backgroundColor: isDebugMode ? '#ff6b6b' : '#4dabf7',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        zIndex: 1000,
      }}
    >
      {isDebugMode ? 'Debug: ON' : 'Debug: OFF'}
    </button>
  );
}
