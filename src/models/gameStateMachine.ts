import { generateTimeUTC } from "../../lib/time/time.ts"
//import { bst } from "../../lib/bst/bst.ts"
import { type gameState, state } from "../../lib/types/state.ts"
import GameSearching from "./GameSearching.ts"
import GameActive from "./GameActive.ts"
import GameRecent from "./GameRecent.ts"


export default class GameStateMachine
{
    #search: GameSearching
    #active: GameActive
    #recent: GameRecent

    constructor()
    {
        this.#search = new GameSearching()
        this.#active = new GameActive()
        this.#recent = new GameRecent()
    }

    changeState({ currentState, userId, gameId }: { currentState: state, userId: number, gameId: number }): boolean
    {
        switch(currentState)
        {
            case state.searching: // Start new game
                return this.#changeStateSearch(userId)
            case state.active: // Run game
                return this.#changeStateActive(userId, gameId)
            case state.complete: // End game
                return this.#changeStateComplete(gameId)
            default:
                throw new Error("State Machine: State not defined.")
        }
    }

    #changeStateSearch(idPlayer1: number): boolean
    {
        const gameNew: gameState = this.#gameNew(idPlayer1)
        this.#recent.add(gameNew)
        this.#search.add(gameNew)
        return true
    }

    #changeStateActive(player2Id: number, gameId: number): boolean
    {
        const game: gameState | null = this.#search.remove(gameId)
        if (game !== null)
        {
            game.status = state.active
            game.userIdDark = player2Id
            this.#active.add(game)
            return true
        }
        return false
    }

    #changeStateComplete(gameId: number): boolean
    {
        const game: gameState | null = this.#active.remove(gameId)
        if (game !== null)
        {
            game.status = state.complete
            return true
        }
        return false

    }

    /**
     * This function generate a game ID between the range specified below: [ min to max ]
     * @returns New game ID
     */
    #gameGenerateId(): number
    {
        const min = 0x112233445566
        const max = 0xFFFFFFFFFFFF
        while (true)
        {
            const gameId = Math.floor( Math.random() * ((max - min) + min) )
            const game = this.#search.find(gameId)
            if (game === null)
            {
                return gameId
            }
        }
    }

    #gameNew(userIdLight: number): gameState
    {
        const gameId = this.#gameGenerateId()
        const timeStarted = generateTimeUTC()
        const gameInfo: gameState =
        {
            userIdLight,
            userIdDark: -1,
            gameId,
            gameHistory: [],
            timeStarted,
            timeCompleted: -1,
            status: state.searching
        }
        return gameInfo
    }
}
