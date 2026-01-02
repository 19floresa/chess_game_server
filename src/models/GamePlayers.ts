import type gameInfo from "../../lib/types/gameInfo.ts"

export default class GameCurrentPlayers 
{
    // Key: Player Id
    #players: Record<number, gameInfo> = {}

    add(playerId: number, game: gameInfo): void
    {
        this.#players[playerId] = game
    }

    remove(playerId: number): gameInfo | null
    {
        const game: gameInfo | undefined = this.#players[playerId]
        delete this.#players[playerId]
        return game === undefined ? null : game
    }

    find(playerId: number): gameInfo | null
    {
        const game: gameInfo | undefined = this.#players[playerId]
        return game === undefined ? null : game
    }

    removeAll(game: gameInfo): void
    {
        const idP1: number = game.idP1
        const idP2: number = game.idP2
        this.remove(idP1)
        this.remove(idP2)
    }
}