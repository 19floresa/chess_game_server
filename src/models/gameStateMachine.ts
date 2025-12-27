import { generateTimeUTC } from "../../lib/time/time.ts"
//import { bst } from "../../lib/bst/bst.ts"
import { type gameState, state } from "../../lib/types/state.ts"
import GameSearching from "./GameSearching.ts"
import GameActive from "./GameActive.ts"
import GameRecent from "./GameRecent.ts"


export class GameStateMachine
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

    changeState({ newState, userId, gameId }: { newState: state, userId: number, gameId: number }): boolean
    {
        switch(newState)
        {
            case state.initialize: // Start new game
                return this.#changeStateInitialize(userId)
            case state.ready:      // Ready to begin
                return this.#changeStateReady(userId, gameId)
            case state.running:    // Run game
                return this.#changeStateRunning(gameId)
            case state.complete:   // End game
                return this.#changeStateComplete(gameId)
            default:
                throw new Error("State Machine: State not defined.")
        }
    }

    #changeStateInitialize(idPlayer1: number): boolean
    {
        const gameNew: gameState = this.#gameNew(idPlayer1)
        this.#recent.add(gameNew)
        this.#search.add(gameNew)
        return true
    }

    #changeStateReady(player2Id: number, gameId: number): boolean
    {
        const game: gameState | null = this.#search.find(gameId)
        if (game !== null)
        {
            game.status = state.ready
            game.idP2 = player2Id
            return true
        }
        return false
    }

    #changeStateRunning(gameId: number): boolean
    {
        const game: gameState | null = this.#search.remove(gameId)
        if (game !== null)
        {
            game.status = state.running
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
            game.timeCompleted = generateTimeUTC()
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

    #gameNew(player1: number): gameState
    {
        const gameId = this.#gameGenerateId()
        const timeStarted = generateTimeUTC()
        const gameInfo: gameState =
        {
            idP1: player1,
            idP2: -1,
            connectedP1: false,
            connectedP2: false,
            gameId,
            gameHistory: [],
            timeStarted,
            timeCompleted: -1,
            lastAccessed: timeStarted,
            status: state.initialize
        }
        return gameInfo
    }

    findMatch(idP2: number): number
    {
        const gameFound: gameState | null  = this.#search.findGame()
        if (gameFound !== null)
        {
            const idP1: number = gameFound.idP1
            return idP1 === idP2 ? -2 : gameFound.gameId
        }
        return -1
    }

    findGameWithP1(idP1: number): gameState | null
    {
        return this.#search.findUserId(idP1, true)
    }

    /**
     * This function return the id of player 1 and 2.
     * @param gameId  Id of the game
     * @returns [ player1, player2 ]
     */
    findPlayersId(gameId: number): [ number, number ]
    {
        const gameInfo: gameState | null = this.#recent.find(gameId)
        if (gameInfo !== null)
        {
            const player1: number = gameInfo.idP1
            const player2: number = gameInfo.idP2
            return [ player1, player2 ]
        }
        return [ -1, -1 ]
    }

    findPlayerConnection(gameId: number): boolean
    {
        const gameInfo: gameState | null = this.#recent.find(gameId)
        if (gameInfo !== null)
        {
            const connectedP1: boolean = gameInfo.connectedP1
            const connectedP2: boolean = gameInfo.connectedP2
            return connectedP1 && connectedP2
        }
        return false
    }

    setPlayerConnection(gameId: number, userId: number, value: boolean): boolean
    {
        const gameInfo: gameState | null = this.#recent.find(gameId)
        if (gameInfo !== null)
        {
            const [ idP1, idP2 ] = this.findPlayersId(gameId)
            if (userId === idP1)
            {
                gameInfo.connectedP1 = value
            }
            else if (userId === idP2)
            {
                gameInfo.connectedP2 = value
            }
            else
            {
                return false
            }
            return true
        }
        return false
    }

    isGameRunning(gameId: number): boolean
    {
        const gameInfo: gameState | null = this.#recent.find(gameId)
        if (gameInfo !== null)
        {
            const currentState: state = gameInfo.status
            return currentState === state.running
        }
        return false
    }
}

export const games: GameStateMachine = new GameStateMachine()

