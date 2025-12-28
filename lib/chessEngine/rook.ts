import Chesspiece from "./chesspiece.ts"

export default class Rook extends Chesspiece
{
    isPositionValid(newX: number, newY: number): boolean
    {
        const [ xDif, yDif ] = this.calcPosDiffByGreater(newX, newY)
        const isMovingVertically   = (xDif === 0) && (yDif !== 0)
        const isMovingHorizontally = (xDif !== 0) && (yDif === 0)
        return ( isMovingVertically ||isMovingHorizontally )
    }
    
    checkJumpedSquares(gameBoard: Chesspiece[][], newX: number, newY: number): boolean
    {
        const board: Chesspiece[][] = structuredClone(gameBoard)
        const [ xDif, yDif ] = this.calcPosDiff(newX, newY)
        const isNeg = (val: number) => val >= 0 ? 1 : -1 
        const dif = ( xDif === 0 ) ? [ 0, isNeg(yDif) ] : [ isNeg(xDif), 0 ]
        const totalDif: number = Math.max(...[ Math.abs(xDif), Math.abs(yDif) ])
        for (let i = 1; i < totalDif; i++)
        {
            const [ hDif, vDif ] = dif
            const newPosY: number = newY + (i * vDif)
            const newPosX: number = newX + (i * hDif)
            const piece: Chesspiece = board[newPosY][newPosX]
            if (piece !== null) return false
        }
        return true
    }

    // TODO: Implement castling
}
