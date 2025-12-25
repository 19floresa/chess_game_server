export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  move: ({ x, y, xNew, yNew }: { x: number, y: number, xNew: number, yNew: number }, callback: any) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number
}