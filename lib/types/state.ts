export enum state {
    initialize,
    ready,
    active,
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
    status: state
}