import { generateTimeUTC } from "../../lib/time/time.ts"
//import { bst } from "../../lib/bst/bst.ts"
import state from "../../lib/types/state.ts"
import type gameInfo from "../../lib/types/gameInfo.ts"
import GameSearching from "./GameSearching.ts"
import GameActive from "./GameActive.ts"
import GameRecent from "./GameRecent.ts"
import GameCurrentPlayers from "./GamePlayers.ts"
import Chessboard from "../../lib/chessEngine/chessboard.ts"
import storeGame from "../../lib/api/storeGame.ts"
import color from "../../lib/types/color.ts"

export class GameStateMachine
{
    #search: GameSearching
    #active: GameActive
    #recent: GameRecent
    #currentPlayers: GameCurrentPlayers

    constructor()
    {
        this.#search = new GameSearching()
        this.#active = new GameActive()
        this.#recent = new GameRecent()
        this.#currentPlayers = new GameCurrentPlayers()
    }

    async changeState({ newState = state.initialize, userId = -1, gameId = -1 , winnerColor = color.light }): Promise<boolean>
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
                return await this.#changeStateComplete(gameId, winnerColor)
            default:
                throw new Error("State Machine: State not defined.")
        }
    }

    #changeStateInitialize(idPlayer1: number): boolean
    {
        const gameNew: gameInfo = this.#gameNew(idPlayer1)
        this.#recent.add(gameNew)
        this.#search.add(gameNew)
        this.#currentPlayers.add(idPlayer1, gameNew)
        return true
    }

    #changeStateReady(player2Id: number, gameId: number): boolean
    {
        const game: gameInfo | null = this.#search.find(gameId)
        if (game !== null)
        {
            this.#currentPlayers.add(player2Id, game)
            game.status = state.ready
            game.idP2 = player2Id
            return true
        }
        return false
    }

    #changeStateRunning(gameId: number): boolean
    {
        const game: gameInfo | null = this.#search.remove(gameId)
        if (game !== null)
        {
            game.status = state.running
            this.#active.add(game)
            return true
        }
        return false
    }

    async #changeStateComplete(gameId: number, winnerColor: color): Promise<boolean>
    {
        const game: gameInfo | null = this.#active.remove(gameId)
        if (game !== null)
        {
            this.#currentPlayers.removeAll(game)
            game.status = state.complete 
            game.timeCompleted = generateTimeUTC()
            game.idWinner = winnerColor === color.light ? game.idP1 : game.idP2
            await storeGame(game)
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

    #gameNew(player1: number): gameInfo
    {
        const gameId = this.#gameGenerateId()
        const timeStarted = generateTimeUTC()
        const game: gameInfo =
        {
            idP1: player1,
            idP2: -1,
            idWinner: -1,
            connectedP1: false,
            connectedP2: false,
            gameId,
            gameHistory: [],
            timeStarted,
            timeCompleted: "",
            lastAccessed: timeStarted,
            status: state.initialize,
            gameEngine: new Chessboard()
        }
        return game
    }

    findMatch(idP2: number): number
    {
        const gameFound: gameInfo | null  = this.#search.findGame()
        if (gameFound !== null)
        {
            const idP1: number = gameFound.idP1
            return idP1 === idP2 ? -2 : gameFound.gameId
        }
        return -1
    }

    findGameWithP1(idP1: number): gameInfo | null
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
        const game: gameInfo | null = this.#recent.find(gameId)
        if (game !== null)
        {
            const player1: number = game.idP1
            const player2: number = game.idP2
            return [ player1, player2 ]
        }
        return [ -1, -1 ]
    }

    findPlayerConnection(gameId: number): boolean
    {
        const game: gameInfo | null = this.#recent.find(gameId)
        if (game !== null)
        {
            const connectedP1: boolean = game.connectedP1
            const connectedP2: boolean = game.connectedP2
            return connectedP1 && connectedP2
        }
        return false
    }

    getGame(gameId: number): gameInfo | null
    {
        return this.#recent.find(gameId)
    }

    findPlayerColor(userId: number, gameId: number): string
    {
        const game: gameInfo | null = this.#recent.find(gameId)
        if (game !== null)
        {
            const [ idP1, idP2 ] = this.findPlayersId(gameId)
            if (userId === idP1)      return "light"
            else if (userId === idP2) return "dark"
            else                      return ""

        }
        return ""
    }

    findPlayerGame(playerId: number): gameInfo | null
    {
        return this.#currentPlayers.find(playerId)
    }

    setPlayerConnection(gameId: number, userId: number, value: boolean): boolean
    {
        const game: gameInfo | null = this.#recent.find(gameId)
        if (game !== null)
        {
            const [ idP1, idP2 ] = this.findPlayersId(gameId)
            if (userId === idP1)
            {
                game.connectedP1 = value
            }
            else if (userId === idP2)
            {
                game.connectedP2 = value
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
        const game: gameInfo | null = this.#recent.find(gameId)
        if (game !== null)
        {
            const currentState: state = game.status
            return currentState === state.running
        }
        return false
    }
}

export const games: GameStateMachine = new GameStateMachine()

