import Chesspiece from "./chesspiece.ts"
import King from "./king.ts"
import Knight from "./knight.ts"
import Pawn from "./pawn.ts"
import Queen from "./queen.ts"
import Rook from "./rook.ts"
import Bishop from "./bishop.ts"
import color from "../types/color.ts"

export default class Player 
{
    #playerPieces: Chesspiece[]

    constructor(c: color)
    {
        const row1 = (c === color.dark ) ? 0 : 7;
        const row2 = (c === color.dark ) ? 1 : 6;
        const data: Chesspiece[] = 
        [
            new King(4, row1, c),
            new Queen(3, row1, c),
            new Bishop(2, row1, c), 
            new Bishop(5, row1, c),
            new Knight(1, row1, c), 
            new Knight( 6, row1, c),
            new Rook(0, row1, c), 
            new Rook(7, row1, c),
        ]

        for (let i = 0; i < 8; i++)
        {
            data.push(new Pawn(i, row2, c))
        }

        this.#playerPieces = data
    }

    getAllPieces(): Chesspiece[]
    {
        return this.#playerPieces
    }

    findPiece(xPos: number, yPos: number): Chesspiece | null
    {
        const pieces: Chesspiece[]  = this.getAllPieces()
        for (const piece of pieces)
        {
            const [ pieceX, pieceY ] = piece.getCurrentPosition()
            if ((xPos === pieceX) && (yPos === pieceY))
            {
                return piece
            }
        }
        return null
    }

    removePiece(piece: Chesspiece): boolean
    {
        const [ targetName, _ ] = piece.getName().split("_")
        const [ xPos, yPos ] = piece.getCurrentPosition()
        const find = (elem: Chesspiece) => 
        {
            const [ x, y ] = elem.getCurrentPosition()
            return (xPos === x) && (yPos === y)
        }

        switch(targetName)
        {
            case "queen":
            case "bishop":
            case "pawn":
            case "knight":
            case "rook":
                const pieces: Chesspiece[] = this.getAllPieces()
                const idx: number = pieces.findIndex(find)
                if (idx !== -1)
                {
                    this.#playerPieces.splice(idx, 1)
                    return true
                }
                break
            default:
                //throw Error(`Cannot remove this piece: ${name}`)
                break
        }
        return false
    }

    addPiece(newPiece: Chesspiece ): void
    {
        const [ targetName, _ ]: string[] = newPiece.getName().split("_")
        switch(targetName)
        {
            case "queen":
            case "bishop":
            case "pawn":
            case "knight":
            case "rook":
                this.#playerPieces.push(newPiece)
                break
            default:
                throw Error(`Cannot remove this piece: ${targetName}`)
        }
    }
}