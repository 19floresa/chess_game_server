import type gameInfo from "../../lib/types/gameInfo.ts"

export default class GameRecent 
{
    #games: Record<number, gameInfo> = {}

    add(game: gameInfo): void
    {
        const gameId = game.gameId
        this.#games[gameId] = game
    }

    remove(gameId: number): gameInfo | null
    {
        const game: gameInfo | undefined = this.#games[gameId]
        delete this.#games[gameId]
        return game === undefined ? null : game
    }

    find(gameId: number): gameInfo | null
    {
        const game: gameInfo | undefined = this.#games[gameId]
        return game === undefined ? null : game
    }
}