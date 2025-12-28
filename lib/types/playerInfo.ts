import color from "./color.ts"

export default class Player
{
    #id: number
    #isConnectedSocket: boolean
    #color: color

    constructor(id: number, isConnected: boolean, color: color)
    {
        this.#id = id
        this.#isConnectedSocket = isConnected
        this.#color = color
    }

    setConnection(isConnected: boolean)
    {
        this.#isConnectedSocket = isConnected
    }

    getPlayerInfo(): { id: number, isConnected: boolean, color: color }
    {
        const id: number = this.#id
        const isConnected: boolean = this.#isConnectedSocket
        const color: color = this.#color
        return { id, isConnected, color }
    }
}