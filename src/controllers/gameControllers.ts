import type { Request, Response } from "express"
import { type gameState, gameNew } from "../models/gameState.ts"
import { gameSearchFind, gameSearchAdd } from "../models/gameState.ts"
import { gameActiveFind, gameActiveAdd } from "../models/gameState.ts"
import { gameAllAdd, gameAllFind } from "../models/gameState.ts"
import { getPort } from "../../lib/port/port.ts"

export function gameSearch(req: Request, res: Response): void
{
    try
    {
        const { id }: { id: string } = req.body
        const ID: number = parseInt(id)
        const gameInfo: gameState = gameNew(ID)
        const port: number = getPort()
        if (gameAllFind(gameInfo.gameId) !== null)
        { // TODO: Modify to return port if game was found... assumption reconnecting
             throw new Error("Game was already created.")
        }

        gameAllAdd(gameInfo)
        gameSearchAdd(gameInfo)

        res.send({ message: "Searching for player...", port }) // TODO: maybe remove sending port
    }
    catch (e)
    {
      res.status(400).json({ message: (e as Error).message })
    }
}

export function gameMove(req: Request, res: Response): void
{
    try
    {
        res.send({ message: "Player moved..." })
    }
    catch (e)
    {
      res.status(400).json({ message: (e as Error).message })
    }
}