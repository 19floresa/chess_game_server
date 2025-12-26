import type { Request, Response } from "express"
import { type gameState, state } from "../../lib/types/state.ts"
import { getPort } from "../../lib/port/port.ts"
import { GameStateMachine, games } from "../models/gameStateMachine.ts"

export default function gameSearch(req: Request, res: Response): void
{
    try
    {
        const { id }: { id: string } = req.body
        const playerId: number = parseInt(id)
        const gameId: number = games.findMatch(playerId) // TODO: Check players are not already in a match
        if (gameId === -2)
        {
            throw new Error("Player 1 and 2 can not be the same person!")
        }
        
        const respMsg = { message: "", gameId, port: getPort() } // TODO: remove sending port
        if (gameId === -1)
        { 
            // Create a new game
            respMsg.message = "New game was created! Waiting on player 2."
            const result: boolean = games.changeState({ newState: state.searching, userId: playerId, gameId: -1 })
            if (result === false)
            {
                // Should never be reached
                throw new Error("New game could not be created.")
            }
        }
        else
        {
            // Add player 2 to a game already created
            respMsg.message = "Game was found!"
            const result: boolean = games.changeState({ newState: state.active, userId: playerId, gameId })
            if (result === false)
            {
                throw new Error("Game was not found.")
            }
        }
        res.send(respMsg)
    }
    catch (e)
    {
      res.status(400).json({ message: (e as Error).message })
    }
}