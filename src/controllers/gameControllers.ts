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
        const port: number = getPort()
        const gameId: number = games.findMatch(playerId) // TODO: Check players are not already in a match
        if (gameId === -2)
        {
            throw new Error("Light and dark player can not be the same person!")
        }
        else if (gameId === -1)
        { 
            // Create a new game
            games.changeState({ newState: state.searching, userId: playerId, gameId: -1 })
        }
        else
        {
            // Add player 2 to a game already created
            games.changeState({ newState: state.active, userId: playerId, gameId })
        }
        res.send({ message: "Searching for player...", port }) // TODO: maybe remove sending port
    }
    catch (e)
    {
      res.status(400).json({ message: (e as Error).message })
    }
}