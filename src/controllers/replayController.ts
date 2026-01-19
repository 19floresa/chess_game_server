import type { Request, Response } from "express"

export default function gameSearch(req: Request, res: Response): void
{
    try
    {
        const { id }: { id: string } = req.body
        res.send({})
    }
    catch (e)
    {
        res.status(400).json({ message: (e as Error).message })
    }
}