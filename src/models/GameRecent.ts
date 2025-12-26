import type { gameState } from "../../lib/types/state.ts"

export default class GameRecent 
{
    #games: Record<number, gameState> = {}

    add(game: gameState): void
    {
        const gameId = game.gameId
        this.#games[gameId] = game
    }

    remove()
    {
        throw new Error("Remove func not built.")
    }

    find(gameId: number): gameState | null
    {
        const game: gameState | undefined = this.#games[gameId]
        return game === undefined ? null : game
    }
}