import type { gameState } from "../types/state.ts"

export class MaxHeap
{
    #nodes: Array<gameState> = []
    constructor()
    {
        this.#clearNodes()
    }

    #getNodes(): Array<gameState>
    {
        return this.#nodes
    }

    #clearNodes(): void
    {
        this.#nodes = []
    }

    add()
    {

    }

    find()
    {

    }

    delete()
    {

    }

    #surfUp()
    {

    }

    #surfDown()
    {
        
    }
}