import type gameInfo from "../../lib/types/gameInfo.ts"

export default class GameSearching 
{
    #games: gameInfo[] = []

    add(game: gameInfo): void
    {
        this.#games.push(game)
    }

    remove(gameId: number): gameInfo | null
    {
        for (let i = 0; i < this.#games.length; i++)
        {
            if (gameId === this.#games[i]?.gameId)
            {
                return (this.#games.splice(i, 1))[0] as gameInfo
            }
        }
        return null
    }

    find(gameId: number): gameInfo | null
    {
        for (const game of this.#games)
        {
            if (gameId === game.gameId)
            {
                return game
            }
        }
        return null
    }

    findUserId(userId: number, isPlayer1: boolean): gameInfo | null
    {
        for (const game of this.#games)
        {
            const id: number = isPlayer1 ? game.idP1 : game.idP2
            if (userId === id)
            {
                return game
            }
        }
        return null

    }

    findGame()
    {
        const games: gameInfo[] =  this.#games
        if (games.length !== 0)
        {
            const game: gameInfo | undefined = games[0]
            return game === undefined ? null : game
        }
        return null
    }
}