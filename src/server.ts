import app from "./app.ts"
import config from "./config/config.ts"
import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: "*" } })

io.on("connection", (socket) => 
{
    console.log("connected!")

    socket.on("disconnect", () =>
    {
        console.log("disconnected!")
    })
})

httpServer.listen(config.port, () => console.log(`Server listening on port ${config.port}`))
