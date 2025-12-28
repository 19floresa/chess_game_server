import { Chesspiece } from "./chesspiece.ts"

export class Knight extends Chesspiece
{
    isPositionValid(newX: number, newY: number): boolean 
    {
        const [ xDif, yDif ] = this.calcPosDiffByGreater(newX, newY)
        const isMovementVerticalL   = (xDif === 1) && (yDif === 2)
        const isMovementHorizontalL = (xDif === 2) && (yDif === 1)
        return (isMovementVerticalL || isMovementHorizontalL)
    }
    
    checkJumpedSquares(gameBoard: Chesspiece[][], newX: number, newY: number): boolean
    {
        return true // skip
    }
}