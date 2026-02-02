import app from "./app.ts"
import { createServer } from "http"
import { Server, type Socket } from "socket.io"
import type { ServerToClientEvents, ClientToServerEvents, 
              InterServerEvents, SocketData } from "../lib/types/socket.ts"
import { games } from "./models/gameStateMachine.ts"
import state from "../lib/types/state.ts"
import type Chessboard from "../lib/chessEngine/chessboard.ts"
import type gameInfo from "../lib/types/gameInfo.ts"
import color from "../lib/types/color.ts"

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

    socket.on("connectPlayer", async ({ userId, gameId }, callback ) =>
    {
        console.log("Player is connected.")
        const game: gameInfo | null = games.findPlayerGame(userId)
        const isReconnecting: boolean = (game !== null) && (games.findPlayerConnection(gameId))
        if (isReconnecting === true) // Resume game already started
        {
            console.log("Reconnecting to a game")
            const gameId: number = game!.gameId
            const color: string = games.findPlayerColor(userId, gameId)
            const room: string = `Room: ${gameId}`
            socket.join(room)
            callback({ status: "ok", message: "Connection to the server was successful.", color })
            io.to(room).emit("startGame") // TODO cannot do this, will need to find another way to reconnect
        }
        else // Start game not running yet
        {
            const isConnected: boolean = games.setPlayerConnection(gameId, userId, true)
            if (isConnected === true)
            {
                const room: string = `Room: ${gameId}`
                socket.join(room)

                const color: string = games.findPlayerColor(userId, gameId)
                callback({ status: "ok", message: "Connection to the server was successful.", color })

                const isP1P2Connected: boolean = games.findPlayerConnection(gameId)
                if (isP1P2Connected === true)
                {
                    await games.changeState({ newState: state.running, userId, gameId })
                    io.to(room).emit("startGame")
                }
            }
            else
            {
                callback({ status: "bad", message: "Could not connect to the server." })
            }
        }
    })

    socket.on("move", ({ x, y, x2, y2 }, callback) => 
    { 
        const rooms: string[] =  [...socket.rooms]
        const room: string = rooms[1] as string // TODO: Check room number, if multiple exist
        const gameId: number = parseInt(room.slice(5))
        if (isNaN(gameId) === false)
        {
            const currentState: boolean = games.isGameRunning(gameId)
            if (currentState === true)
            {
                const game: gameInfo | null = games.getGame(gameId)
                const gameEngine: Chessboard | null = game !== null ? game.gameEngine : null
                if (gameEngine !== null)
                {
                    console.log(`moved: (${x}, ${y}) to (${x2}, ${y2})`)
                    const isMoveValid: boolean = gameEngine.move({ oldX: x, oldY: y, newX: x2, newY: y2 })
                    if (isMoveValid === true)
                    {
                        // Save game move
                        const capture: number = gameEngine.getLastCapturedPiece()
                        game!.gameHistory.push([ x, y, x2, y2, 0, capture ])

                        // Response to game move
                        const isPromoting = gameEngine.isWaitingOnPlayerPromote()
                        callback({ status: "ok", message: `Moved: (${x}, ${y}) to (${x2}, ${y2}).`, isPromoting })
                        if (isPromoting == false)
                        {
                            socket.to(room).emit("validMoveOpponent", { x, y, x2, y2, promote: 0 })

                            // Save game once a player wins
                            const playerWinner: color | null = gameEngine.getWinner()
                            if (playerWinner !== null)
                            {
                                console.log("A player won!")
                                const isWinnerLight: boolean = playerWinner === color.light
                                games.changeState({ newState: state.complete, gameId, winnerColor: playerWinner})
                                io.to(room).emit("endGame", { isWinnerLight })
                            }
                        }
                    }
                    else
                    {
                        callback({ status: "bad", message: "Invalid Position."})
                    }
                }
                else
                {
                    callback({ status: "bad", message: "Game was not found."})
                }
            }
            else 
            {
                callback({ status: "bad", message: "Game state: Game is not running."})
            }
        }
        else
        {
            callback({ status: "bad", message: "Invalid room number"})
        }
    })

    socket.on("promote", ({ x, y, promote}, callback) =>
    {
        const rooms: string[] =  [...socket.rooms]
        const room: string = rooms[1] as string // TODO: Check room number, if multiple exist
        const gameId: number = parseInt(room.slice(5))
        if (isNaN(gameId) === false)
        {
            const currentState: boolean = games.isGameRunning(gameId)
            if (currentState === true)
            {
                const game: gameInfo | null = games.getGame(gameId)
                const gameEngine: Chessboard | null = game !== null ? game.gameEngine : null
                if (gameEngine !== null)
                {
                    console.log(`Promoted: (${x}, ${y}) to ${promote}`)
                    const lastStep = game?.gameHistory[-1]
                    if (lastStep !== null)
                    {
                        const result = gameEngine.promote(x,y, promote)
                        if (result === true)
                        {
                            lastStep![4] = promote
                            const [ x, y, x2, y2, _ ] = lastStep!
                            callback({ status: "ok", message: `moved: (${x}, ${y}) to ${promote}` })
                            socket.to(room).emit("validMoveOpponent", { x, y, x2, y2, promote })
                        }
                        else
                        {
                            callback({ status: "bad", message: "Promotion value is invalid."})
                        }
                    }
                    else
                    {
                        callback({ status: "bad", message: "Invalid promotion request."})
                    }

                }
                else
                {
                    callback({ status: "bad", message: "Game was not found."})
                }
            }
            else 
            {
                callback({ status: "bad", message: "Game state: Game is not running."})
            }
        }
        else
        {
            callback({ status: "bad", message: "Invalid room number"})
        }

    })

    socket.on("disconnect", () =>
    {
        console.log("disconnected!") 
    })
})

export default httpServer