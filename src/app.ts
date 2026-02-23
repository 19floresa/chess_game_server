import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import gameRoutes from "./routes/gameRoutes.ts"
import { errorHandler } from "./middleware/errorHandler.ts"

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST',/* 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'*/],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
}))

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/game", gameRoutes)

// Error Handling
app.use(errorHandler)

export default app