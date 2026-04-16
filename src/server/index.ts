import express from 'express'
import dotenv from 'dotenv'
import { projectsRouter } from './routes/projects'
import { tasksRouter } from './routes/tasks'
import { itemsRouter } from './routes/items'

dotenv.config()
const app = express()
app.use(express.json())

app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/items', itemsRouter)

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
