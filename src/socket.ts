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
        // Check if game Id is invalid
        const rooms: string[] =  [...socket.rooms]
        const room: string = rooms[1] as string // TODO: Check room number, if multiple exist
        const gameId: number = parseInt(room.slice(5))
        if (isNaN(gameId) === true)
        {
            callback({ status: "bad", message: "Invalid room number"})
            return
        }

        // Check if game is running
        const currentState: boolean = games.isGameRunning(gameId)
        if (currentState === false)
        {
            callback({ status: "bad", message: "Game state: Game is not running."})
            return
        }

        // Check if game does not exist
        const game: gameInfo | null = games.getGame(gameId)
        const gameEngine: Chessboard | null = game !== null ? game.gameEngine : null
        if (gameEngine === null)
        {
            callback({ status: "bad", message: "Game was not found."})
            return
        }

        // Check if move is invalid
        console.log(`moved: (${x}, ${y}) to (${x2}, ${y2})`)
        const isMoveValid: boolean = gameEngine.move({ oldX: x, oldY: y, newX: x2, newY: y2 })
        if (isMoveValid === false)
        {
            callback({ status: "bad", message: "Invalid Position."})
            return
        }

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
    })

    socket.on("promote", ({ x, y, promote }, callback) =>
    { 
        // Check if game Id is invalid
        const rooms: string[] =  [...socket.rooms]
        const room: string = rooms[1] as string // TODO: Check room number, if multiple exist
        const gameId: number = parseInt(room.slice(5))
        if (isNaN(gameId) === true)
        {
            callback({ status: "bad", message: "Invalid room number"})
            return
        }

        // Check if game is running
        const currentState: boolean = games.isGameRunning(gameId)
        if (currentState === false)
        {
            callback({ status: "bad", message: "Game state: Game is not running."})
            return
        }

        // Check if game does not exist
        const game: gameInfo | null = games.getGame(gameId)
        const gameEngine: Chessboard | null = game !== null ? game.gameEngine : null
        if (gameEngine === null)
        {
            callback({ status: "bad", message: "Game was not found."})
            return
        }

        // Check if game move has been performed
        const lastStep = game?.gameHistory[-1]
        if (lastStep === null)
        {
            callback({ status: "bad", message: "Invalid promotion request."})
            return
        }

        // Check if promote is valid
        const result = gameEngine.promote(x,y, promote)
        if (result === false)
        {
            callback({ status: "bad", message: "Promotion value is invalid."})
            return
        }

        console.log(`Promoted: (${x}, ${y}) to ${promote}`)
        lastStep![4] = promote
        const [ xPos, yPos, x2, y2, _ ] = lastStep!
        callback({ status: "ok", message: `Promoted: (${x}, ${y}) to ${promote}` })
        socket.to(room).emit("validMoveOpponent", { x: xPos, y: yPos, x2, y2, promote })

    })

    socket.on("disconnect", () =>
    {
        console.log("disconnected!") 
    })
})

export default httpServer