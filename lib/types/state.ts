export enum state {
    initialize,
    ready,
    running,
    complete
}

export interface gameState {
    idP1: number // light
    idP2: number // dark
    connectedP1: boolean
    connectedP2: boolean
    gameId: number
    gameHistory: []
    timeStarted: number
    timeCompleted: number
    lastAccessed: number
    status: state
}