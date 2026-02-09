import Chesspiece from "./chesspiece.ts"
import color from "../types/color.ts"

export default class Pawn extends Chesspiece
{
    #firstMove: boolean = true
    #captureFlag = false
    isPositionValid(newX: number, newY: number): boolean 
    {
        const [ xDif, yDif ] = this.calcPosDiffByColor(newX, newY)
        if ((Math.abs(xDif) === 1) && (yDif === 1))
        {
            this.#captureFlag = true
            return true // capture piece
        }
        else if (this.#firstMove)
        {
            return (xDif === 0) && (yDif >= 1) && (yDif <= 2)
        }
        else
        {
            return (xDif === 0) && (yDif === 1)
        }
    }

    checkJumpedSquares(gameBoard: Array<Array<Chesspiece|null>>, newX: number, newY: number): boolean
    {
        const board: Array<Array<Chesspiece|null>> = structuredClone(gameBoard)
        const piece: Chesspiece | null = this.getBoardPiece(board, newX, newY)
        const [ oldX, oldY ] = this.getCurrentPosition()
        const [ xDif, yDif ] = this.calcPosDiff(newX, newY)
        if ((piece !== null) && (xDif === 0)) return false // stop vertical movement if any piece exists
        
        if (Math.abs(yDif) === 2)
        {
            // Moving over 2 squares
            const dif: number = (yDif === -2) ? 1 : -1
            const temp: Chesspiece | null = this.getBoardPiece(board, oldX, oldY + dif)
            if (temp !== null) return false
        }
        else if (this.#captureFlag === true)
        {
            this.#captureFlag = false

            const oldPiece: Chesspiece | null = this.getBoardPiece(gameBoard, newX, newY) // not sure why its not working with board???
            if (oldPiece === null) return false
            const oldPieceColor: color = oldPiece.getColor()
            const color: color = this.getColor()
            if (oldPieceColor === color) return false
        }
        
        return true
    }

    setFirstMove()
    {
        this.#firstMove = false
    }

    // TODO: Implement en passant
}