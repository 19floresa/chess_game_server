import Chesspiece from "./chesspiece.ts"

export default class King extends Chesspiece
{
    isPositionValid(newX: number, newY: number): boolean {
        const [ xDif, yDif ] = this.calcPosDiffByGreater(newX, newY)
        return (xDif <= 1) && (yDif <= 1)
    }

    checkJumpedSquares(gameBoard: Array<Array<Chesspiece|null>>, newX: number, newY: number): boolean
    {
        return true // skip
    }
}