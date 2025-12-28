import { Chesspiece } from "./chesspiece.ts"
import { Rook } from "./rook.ts"
import { Bishop } from "./bishop.ts"

export class Queen extends Chesspiece
{
    #bishop: Bishop
    #rook: Rook
    constructor(newX: number, newY: number, color: string)
    {
        super(newX, newY, color)
        this.#bishop = new Bishop(newX, newY, color)
        this.#rook = new Rook(newX, newY, color)
    }

    #getRook(): Rook
    {
        this.#rook.setNewPosition(...this.getCurrentPosition())
        return this.#rook
    }

    #getBishop()
    {
        this.#bishop.setNewPosition(...this.getCurrentPosition())
        return this.#bishop
    }

    checkRook(newX: number, newY: number): boolean
    {
        const rook: Rook = this.#getRook()
        return rook.isPositionValid(newX, newY)
    }

    checkBishop(newX: number, newY: number): boolean
    {
        const bishop: Bishop = this.#getBishop()
        return bishop.isPositionValid(newX, newY)
    }

    isPositionValid(newX: number, newY: number): boolean {
        const isValidMoveRook: boolean = this.checkRook(newX, newY)
        const isValidMoveBishop: boolean = this.checkBishop(newX, newY)
        return (isValidMoveRook || isValidMoveBishop)
    }
    
    checkJumpedSquares(gameBoard: Chesspiece[][], newX: number, newY: number): boolean
    {
        const [ xDif, yDif ] = this.calcPosDiff(newX, newY)
        if ((xDif === 0) || (yDif === 0))
        {
            const rook: Rook = this.#getRook()
            return rook.checkJumpedSquares(gameBoard, newX, newY)
        }
        else
        {
            const bishop: Bishop = this.#getBishop()
            return bishop.checkJumpedSquares(gameBoard, newX, newY)
        }
    }
}