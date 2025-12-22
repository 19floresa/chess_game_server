import express from "express"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/errorHandler.ts"

import gameRoutes from "./routes/gameRoutes.ts"

const app = express()

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/game", gameRoutes)

// Error Handling
app.use(errorHandler)

export default app