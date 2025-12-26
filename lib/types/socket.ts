export interface ServerToClientEvents {
  startGame: (callback: any) => void
  endGame: (callback: any) => void
}

export interface ClientToServerEvents {
    connectPlayer2: (callback: any) => void
    move: ({ x, y, xNew, yNew }: { x: number, y: number, xNew: number, yNew: number }, callback: any) => void
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number
}