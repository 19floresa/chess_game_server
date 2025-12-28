import { state } from "./state.ts"
import Chessboard from "../chessEngine/chessboard.ts"

export default interface gameInfo {
    idP1: number // light
    idP2: number // dark
    connectedP1: boolean
    connectedP2: boolean
    gameId: number
    gameHistory: []
    timeStarted: number
    timeCompleted: number
    lastAccessed: number // TODO: handle this
    status: state
    gameEngine: Chessboard
}