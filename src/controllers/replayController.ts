import type { Request, Response } from "express"
import postFetch from "../../lib/api/postFetch.ts"

export default async function replayGame(req: Request, res: Response): Promise<void>
{
    try
    {
        console.log("Retrieving Replay...")
        const { playerId, gameId } = req.body
        const [ status, body ] = await postFetch({ playerId, gameId }, "replay")
        if (status === 200)
        {
            res.send(body)
        }
        else
        {
            throw new Error("Replays could not be retrieved.")
        }
    }
    catch (e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}