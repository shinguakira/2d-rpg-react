import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

// Game state endpoint example
app.get('/api/game-state', (c) => {
  return c.json({
    status: 'active',
    players: [],
    gameTime: Date.now()
  })
})

// Start the server
const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
