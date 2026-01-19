import state from "./state.ts"
import Chessboard from "../chessEngine/chessboard.ts"

export default interface gameInfo {
    idP1: number // light
    idP2: number // dark
    idWinner: number
    connectedP1: boolean
    connectedP2: boolean
    gameId: number
    gameHistory: [ number, number, number, number ][]
    timeStarted: string
    timeCompleted: string
    lastAccessed: string // TODO: handle this
    status: state
    gameEngine: Chessboard
}