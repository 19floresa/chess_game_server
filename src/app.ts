import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import gameRoutes from "./routes/gameRoutes.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import config from "./config/config.ts"

const app = express()

app.use(cors({
    origin: [ config.url ], // example:  "http://16.145.81.136:3000"
    methods: ['GET', 'POST' ],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
}))

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/game", gameRoutes)

// Error Handling
app.use(errorHandler)

export default app