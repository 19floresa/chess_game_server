export interface ServerToClientEvents {

  /**
   * This function tells the client to began the game.
   * @param callback  Callback function
   */
  startGame: (callback: any) => void

  /**
   * This function tells the client to end the game.
   * @param callback  Callback function
   */
  endGame: (callback: any) => void
}

export interface ClientToServerEvents {
    /**
     * This function setups the connection of player 2.
     * @param callback  Callback function
     */
    connectPlayer2: (callback: any) => void

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
     * @param param0.xNew  New horizontal position
     * @param param0.yNew  New vertical position
     * @param callback  Callback function
     */
    move: ({ x, y, xNew, yNew }: { x: number, y: number, xNew: number, yNew: number }, callback: any) => void
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number
}