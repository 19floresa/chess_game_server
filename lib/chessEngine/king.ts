import { Chesspiece } from "./chesspiece.ts"

export class King extends Chesspiece
{
    isPositionValid(newX: number, newY: number): boolean {
        const [ xDif, yDif ] = this.calcPosDiffByGreater(newX, newY)
        return (xDif <= 1) && (yDif <= 1)
    }

    checkJumpedSquares(gameBoard: Chesspiece[][], newX: number, newY: number): boolean
    {
        return true // skip
    }
}