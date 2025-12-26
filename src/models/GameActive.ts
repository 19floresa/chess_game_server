import type { gameState } from "../../lib/types/state.ts"

export default class GameActive 
{
    // Key: Game Id
    #games: Record<number, gameState> = {}

    add(game: gameState): void
    {
        const gameId: number = game.gameId
        this.#games[gameId] = game
    }

    remove(gameId: number): gameState | null
    {
        const game: gameState | undefined = this.#games[gameId]
        delete this.#games[gameId]
        return game === undefined ? null : game
    }

    find(gameId: number): gameState | null
    {
        const game: gameState | undefined = this.#games[gameId]
        return game === undefined ? null : game
    }
}