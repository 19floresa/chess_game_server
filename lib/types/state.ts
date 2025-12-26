export enum state {
    searching,
    active,
    complete
}

export interface gameState {
    userIdLight: number
    userIdDark: number
    gameId: number
    gameHistory: []
    timeStarted: number
    timeCompleted: number
    status: state
}