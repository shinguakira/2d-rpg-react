import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface GameState {
  players: {
    id: string;
    x: number;
    y: number;
    health: number;
    score: number;
  }[];
  gameTime: number;
  status: 'active' | 'paused';
}

const app = new Hono();

// Enable CORS for frontend
app.use(
  '/*',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Game state
let gameState: GameState = {
  players: [],
  gameTime: Date.now(),
  status: 'active',
};

// Get game state
app.get('/api/game-state', c => {
  return c.json(gameState);
});

// Update player position
app.post('/api/player/:id/position', async c => {
  const { id } = c.req.param();
  const { x, y } = await c.req.json();

  const player = gameState.players.find(p => p.id === id);
  if (player) {
    player.x = x;
    player.y = y;
  }

  return c.json({ success: true });
});

// Join game
app.post('/api/join', c => {
  const playerId = Math.random().toString(36).substring(7);

  gameState.players.push({
    id: playerId,
    x: 400,
    y: 300,
    health: 100,
    score: 0,
  });

  return c.json({ playerId });
});

// Leave game
app.delete('/api/player/:id', c => {
  const { id } = c.req.param();
  gameState.players = gameState.players.filter(p => p.id !== id);
  return c.json({ success: true });
});

// Start the server
const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
