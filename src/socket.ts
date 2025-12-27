import app from "./app.ts"
import { createServer } from "http"
import { Server, type Socket } from "socket.io"
import type { ServerToClientEvents, ClientToServerEvents, 
              InterServerEvents, SocketData } from "../lib/types/socket.ts"
import { games } from "./models/gameStateMachine.ts"
import { state } from "../lib/types/state.ts"

// TODO: Check that a player does not start another game
// TODO: Cleanup stale games
// TODO: Check that a player does not try to reconnect after a game

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

    socket.on("connectPlayer", ({ userId, gameId }, callback ) =>
    {
        console.log("Player is connected.")
        const isConnected: boolean = games.setPlayerConnection(gameId, userId, true)
        if (isConnected === true)
        {
            const room: string = `Room: ${gameId}`
            socket.join(room)
            const isP1P2Connected: boolean = games.findPlayerConnection(gameId)
            if (isP1P2Connected === true)
            {
                games.changeState({ newState: state.running, userId, gameId })
                io.to(room).emit("startGame")
            }
            callback({ status: "ok", message: "Connection to the server was successful." })
        }
        else
        {
            callback({ status: "bad", message: "Could not connect to the server." })
        }
    })

    socket.on("move", ({ x, y, xNew, yNew }, callback) => 
    { 
        const rooms: string[] =  [...socket.rooms]
        const room: string = rooms[1] as string // TODO: Check room number, if multiple exist
        const gameId: number = parseInt(room.slice(5))
        if (isNaN(gameId))
        {
            callback({ status: "bad", message: "Invalid room number"})
        }
        else
        {
            const currentState: boolean = games.isGameRunning(gameId)
            if (currentState === true)
            {
                console.log(`moved: (${x}, ${y}) to (${xNew}, ${yNew})`)
                callback({ status: "ok", message: `moved: (${x}, ${y}) to (${xNew}, ${yNew}).`})
            }
            else 
            {
                callback({ status: "bad", message: "Game state: Game is not fully setup."})
            }
        }
    })

    socket.on("disconnect", () =>
    {
        console.log("disconnected!") // TODO: Save data to db
    })
})

export default httpServer