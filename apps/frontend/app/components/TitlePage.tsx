import { useState } from 'react';

interface TitlePageProps {
  onStartGame: () => void;
}

export default function TitlePage({ onStartGame }: TitlePageProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // CSS styles from root.tsx
  const styles = {
    titleScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
    },
    buttonContainer: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '50vh',
    },
    startButton: (isHovered: boolean) => ({
      backgroundColor: isHovered ? 'rgba(100, 100, 200, 0.8)' : 'rgba(70, 70, 150, 0.7)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      borderRadius: '10px',
      padding: '15px 30px',
      fontSize: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '200px',
      textAlign: 'center',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    }),
  };
  
  return (
    <div style={styles.titleScreen as React.CSSProperties}>
      <img src="/images/titlePage.png" alt="Game Title" style={styles.titleImage as React.CSSProperties} />
      <div style={styles.buttonContainer as React.CSSProperties}>
        <button 
          style={styles.startButton(hoveredButton === 'start') as React.CSSProperties}
          onMouseEnter={() => setHoveredButton('start')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={onStartGame}
        >
          Start Game
        </button>
        <button 
          style={styles.startButton(hoveredButton === 'options') as React.CSSProperties}
          onMouseEnter={() => setHoveredButton('options')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Options
        </button>
        <button 
          style={styles.startButton(hoveredButton === 'credits') as React.CSSProperties}
          onMouseEnter={() => setHoveredButton('credits')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Credits
        </button>
      </div>
    </div>
  );
}
