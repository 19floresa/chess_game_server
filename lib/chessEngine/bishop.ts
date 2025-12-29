import Chesspiece from "./chesspiece.ts"

export default class Bishop extends Chesspiece
{
    isPositionValid(newX: number, newY: number): boolean 
    {
        const [ xDif, yDif ] = this.calcPosDiffByGreater(newX, newY)
        return (xDif === yDif) && (xDif !== 0) && (yDif !== 0)
    }

    checkJumpedSquares(gameBoard: Array<Array<Chesspiece|null>>, newX: number, newY: number): boolean
    {
        const board: Array<Array<Chesspiece|null>> = structuredClone(gameBoard)
        const [ xDif, yDif ] = this.calcPosDiff(newX, newY)
        const vDif: number = (yDif >= 0) ? 1 : -1
        const hDif: number = (xDif >= 0) ? 1 : -1
        const totalDif: number = Math.abs(yDif) // yDiff === xDiff, so doesnt matter which one i choose
        for (let i = 1; i < totalDif; i++)
        {
            const newPosY: number = newY + (i * vDif)
            const newPosX: number = newX + (i * hDif)
            const piece: Chesspiece | null = this.getBoardPiece(board, newPosX, newPosY)
            if (piece !== null) return false
        }
        return true
    }

}