import type { gameState } from "../../lib/types/state.ts"

export default class GameSearching 
{
    #games: gameState[] = []

    add(game: gameState): void
    {
        this.#games.push(game)
    }

    remove(gameId: number): gameState | null
    {
        for (let i = 0; i < this.#games.length; i++)
        {
            if (gameId === this.#games[i]?.gameId)
            {
                return (this.#games.splice(i, 1))[0] as gameState
            }
        }
        return null
    }

    find(gameId: number): gameState | null
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

    findUserId(userId: number, isLight: boolean): gameState | null
    {
        for (const game of this.#games)
        {
            const id: number = isLight ? game.userIdLight : game.userIdDark
            if (userId === id)
            {
                return game
            }
        }
        return null

    }

    findGame()
    {
        const games: gameState[] =  this.#games
        if (games.length !== 0)
        {
            const game: gameState | undefined = games[0]
            return game === undefined ? null : game
        }
        return null
    }
}