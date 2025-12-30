import type { Request, Response } from "express"
import state from "../../lib/types/state.ts"
import type gameInfo from "../../lib/types/gameInfo.ts"
import { getPort } from "../../lib/port/port.ts"
import { games } from "../models/gameStateMachine.ts"

export default function gameSearch(req: Request, res: Response): void
{
    try
    {
        const { id }: { id: string } = req.body
        const playerId: number = parseInt(id)
        const gameId: number = games.findMatch(playerId) // TODO: Check players are not already in a match
        const respMsg = { message: "", gameId, port: getPort() } // TODO: remove sending port
        switch (gameId)
        {
            case -2: // Invalid player 2
            {
                throw new Error("Player 1 and 2 can not be the same person!")
            }
            case -1: // Create a new game
            {
                respMsg.message = "New game was created! Waiting for player 2."
                const result: boolean = games.changeState({ newState: state.initialize, userId: playerId, gameId: -1 })
                if (result === false)
                {
                    // Should never be reached
                    throw new Error("New game could not be created.")
                }

                const game: gameInfo | null = games.findGameWithP1(playerId)
                if (game === null)
                {
                    throw new Error("Could not find created game.")
                }
                respMsg.gameId = game.gameId
                break
            }
            default:
            {
                if (gameId < 0)
                {
                    throw new Error("Invalid game room number.")
                }
                // Add player 2 to a game already created
                respMsg.message = "Game was found! Connecting to the match."
                const result: boolean = games.changeState({ newState: state.ready, userId: playerId, gameId })
                if (result === false)
                {
                    throw new Error("Game was not found.")
                }
                break
            }
        }
        res.send(respMsg)
    }
    catch (e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}