import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import documentRoutes from './routes/document.route'
import healthRoutes from './routes/health.route'

dotenv.config({path: '../.env'})

const PORT = process.env.PORT || 3001

const app = express()


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// routes
app.use("api/v1/document", documentRoutes)
app.use("api/v1/health", healthRoutes)
app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
})