import app from "./app.ts"
import { createServer } from "http"
import { Server, type Socket } from "socket.io"
import type { ServerToClientEvents, ClientToServerEvents, 
              InterServerEvents, SocketData } from "../lib/types/socket.ts"
import { games } from "./models/gameStateMachine.ts"

const httpServer = createServer(app)
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, { cors: { origin: "*" } }) // TODO: Remove *

io.on("connection", (socket: Socket) => 
{
    console.log("connected!")

    socket.on("connectPlayer2", ( _, callback ) =>
    {
        console.log("Player 2 is connected.")
        callback({ status: "ok"})
    })

    socket.on("move", ({ x, y, xNew, yNew }, callback) => 
    { 
        console.log(`moved: (${x}, ${y}) to (${xNew}, ${yNew})`)
        callback({ status: "ok"})
    })

    socket.on("disconnect", () =>
    {
        console.log("disconnected!") // TODO: Save data to db
    })
})

export default httpServer