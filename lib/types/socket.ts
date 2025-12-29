export interface ServerToClientEvents {

  /**
   * This function tells the client to began the game.
   */
  startGame: () => void

  /**
   * This function tells the client to end the game.
   */
  endGame: () => void
  connectPlayer: () => void
}

export interface ClientToServerEvents {
    /**
     * This function setups player in the game.
     * @param param0.userId  Id of player
     * @param param0.gameId  Room number of the game
     * @param callback  Callback function
     */
    connectPlayer: ({ userId, gameId }: { userId: number, gameId: number }, callback: any) => void

    /**
     * This function closes a room early.
     * NOTE: nothing will be saved in the database
     * @param param0.gameId  Room number of the game
     * @param callback  Callback function
     */
    closeGame: ({ gameId }: { gameId: number }, callback: any) => void

    /**
     * This function validates if a piece can move from the old to the new position.
     * @param param0.x  Old horizontal position
     * @param param0.y  Old vertical position
     * @param param0.newX  New horizontal position
     * @param param0.newY  New vertical position
     * @param callback  Callback function
     */
    move: ({ x, y, newX, newY }: { x: number, y: number, newX: number, newY: number }, callback: any) => void
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number
}