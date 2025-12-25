import { Chesspiece } from "./chesspiece.ts"

export class Pawn extends Chesspiece
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

    checkJumpedSquares(gameBoard: Chesspiece[][], newX: number, newY: number): boolean
    {
        const board: Chesspiece[][] = structuredClone(gameBoard)
        const piece: Chesspiece = gameBoard[newY][newX]
        const [ oldX, oldY ] = this.getCurrentPosition()
        const [ xDif, yDif ] = this.calcPosDiff(newX, newY)
        if ((piece !== null) && (xDif === 0)) return false // stop vertical movement if any piece exists
        
        if (Math.abs(yDif) === 2)
        {
            // Moving over 2 squares
            const dif: number = (yDif === -2) ? 1 : -1
            if (board[oldY + dif][oldX] !== null) return false
        }
        else if (this.#captureFlag === true)
        {
            this.#captureFlag = false

            const oldPiece: Chesspiece = gameBoard[newY][newX] // not sure why its not working with board???
            if (oldPiece === null) return false
            const oldPieceColor: string = oldPiece.getColor()
            const color: string = this.getColor()
            if (oldPieceColor === color) return false
        }
        
        this.#firstMove = false
        return true
    }

    // TODO: Implement en passant
}