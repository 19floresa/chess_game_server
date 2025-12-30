import Chesspiece from "./chesspiece.ts"
import Player from "./player.ts"
import color from "../types/color.ts"
import King from "./king.ts"
import Queen from "./queen.ts"
import Rook from "./rook.ts"
import Knight from "./knight.ts"
import Bishop from "./bishop.ts"

export default class Chessboard 
{
    readonly maxLength: number = 8
    readonly maxWidth: number = 8

    #player1: Player  // black player (dark)
    #player2: Player  // white player (light)

    #currentPlayer: color
    #gameBoard: Array<Array<Chesspiece| null>>

    constructor()
    {
        const player1: Player = new Player(color.dark)
        const player2: Player = new Player(color.light)
        const gameBoard: Chesspiece[][] = new Array(this.maxLength)
        for (let i = 0; i < this.maxLength; i++)
        {
            gameBoard[i] = new Array(this.maxWidth).fill(null)
        }

        this.#gameBoard = gameBoard
        for (const piece of player1.getAllPieces())
        {
            const [ x, y ] = piece.getCurrentPosition()
            this.#setPiece(piece, x, y)
        }

        for (const piece of player2.getAllPieces())
        {
            const [ x, y ] = piece.getCurrentPosition()
            this.#setPiece(piece, x, y)
        }

        this.#gameBoard = gameBoard
        this.#player1 = player1
        this.#player2 = player2
        this.#currentPlayer = color.light
    }

    move({ oldX, oldY, 
           newX, newY }: { oldX: number, oldY: number, 
                           newX: number, newY: number }): boolean
    {
        if (!this.isWithinValidRange(newX, newY)) return false
        if (!this.isWithinValidRange(oldX, oldY)) return false

        const piece: Chesspiece | null = this.#getPiece(oldX, oldY)
        const playerColor: color = this.getCurrentPlayer()
       
        if (piece === null)                                    return false // ignore empty squares
        if (playerColor !== piece.getColor())                  return false // Cant move pieces from other player
        if (!piece.move(newX, newY))                           return false // ignore invalid moves
        if (!this.#checkNewSquare(playerColor, newX, newY))    return false // Dont move to square of our pieces
        if (!this.#checkSquaresJumped(piece, newX, newY))      return false // Check all squares jumped over are empty
        if (this.#isKingInCheck() && !(piece instanceof King)) return false // Check if king will be in check

        const oldPiece: Chesspiece | null = this.#getPiece(newX, newY)
        if (oldPiece !== null) // remove piece from player
        {
            const otherPlayerColor: color = (playerColor === color.dark) ?  color.light : color.dark
            const otherPlayer: Player =  this.#getPlayer(otherPlayerColor)
            otherPlayer.removePiece(oldPiece)
        }

        this.#movePiece(piece, newX, newY)
        this.changePlayer()

        // const [ targetName, targetColor] = piece.getName().split("_") // TODO fix and put before piece is moved to check if king is in checkmate
        // if ((targetName === "pawn"))
        // {
        //     if ((targetColor === "dark") && (newY === 7))   
        //     {
        //         this.#promote(newX, newY)
        //     }
        //     else if ((targetColor === "light") && (newY === 0))
        //     {
        //         this.#promote(newX, newY)
        //     }
        // } 
        
        // TODO: win condition
        // TODO: stalement
        return true
    }

    // #promote(x: number, y: number) // TODO: Move to frontend
    // {
    //     const piece: Chesspiece = this.#getPiece(x, y)! // NOTE: Piece will always be a pawn
    //     const color: color = piece.getColor()
    //     let val: string | null= ""
    //     let n: number = -1
    //     while(true)
    //     {
    //         val = prompt("Promote Pawn: Queen (1), Rook (2), Bishop (3), Knight (4):")
    //         if (val === null) continue
    //         n = Number(val)
    //         if (isNaN(n)) continue
    //         if ((n > 0) && (n < 5)) break
    //     }

    //     let newPiece: Chesspiece
    //     switch(n)
    //     {
    //         case 1:
    //             newPiece = new Queen(x, y, color)
    //             break
    //         case 2:
    //             newPiece = new Rook(x, y, color)
    //             break
    //         case 3:
    //             newPiece = new Bishop(x, y, color)
    //             break
    //         case 4:
    //             newPiece = new Knight(x, y, color)
    //             break
    //         default:
    //             throw Error(`Pawn pronotion is not valid. ${n}`)
    //     }

    //     const player: Player = this.#getPlayer(color)
    //     player.removePiece(piece)
    //     player.addPiece(newPiece)
    //     this.#setPiece(newPiece, x, y)
    // }
    
    isWithinValidRange(newX: number, newY: number): boolean 
    {
        const [ maxWidth, maxLength ] = this.getBoardDimensions()
        const [ minWidth, minLength ] = [ 0, 0 ]
        const xValid = ((newX >= minWidth) && (newX < maxWidth))
        const yValid = ((newY >= minLength) && (newY < maxLength))
        return (xValid && yValid)
    }

    #isKingInCheck(c: color = this.getCurrentPlayer(), board: (Chesspiece|null)[][] = this.#gameBoard): boolean
    {
        const [ current, opponent ] = c === color.light ? [ this.#player2, this.#player1 ] : [ this.#player1, this.#player2 ]
        const currentKing: Chesspiece = current.getKing()
        const opponentPieces: Chesspiece[] = opponent.getAllPieces()
        const [ x, y ]: [ number, number ] = currentKing.getCurrentPosition()
        for (const piece of opponentPieces)
        {
            // Check if any piece can reach the king
            const result: boolean = piece.move(x, y)
            if (result === true) 
            {
                const result2: boolean = this.#checkSquaresJumped(piece, x, y, board)
                if (result2 === true)
                {
                    return true
                }
            }
        }
        return false
    }

    changePlayer()
    {
        const c: color = this.getCurrentPlayer()
        this.#currentPlayer = (c === color.dark) ? color.light : color.dark
    }

    #checkNewSquare(playerColor: color, newX: number, newY: number)
    {
        const piece: Chesspiece | null = this.#getPiece(newX, newY)
        return ((piece === null) || (piece.getColor() !== playerColor))
    }

    #checkSquaresJumped(piece: Chesspiece, newX: number, newY: number, 
                                           board: (Chesspiece|null)[][] = this.#gameBoard): boolean
    {
        return piece.checkJumpedSquares(board, newX, newY)
    }

    getCurrentPlayer(): color
    {
        return this.#currentPlayer
    }

    #getPlayer(c: color): Player
    {
        return (c === color.dark) ? this.#player1 : this.#player2 // TODO Player 1 should be light
    }

    #getPiece(xPos: number, yPos: number): Chesspiece | null
    {
        const row: Array<Chesspiece|null> = this.#gameBoard[yPos] as Array<Chesspiece|null>
        const piece: Chesspiece | null | undefined = row[xPos]!
        return piece === undefined ? null : piece
    }

    getBoardDimensions(): [ number, number]
    {
        return [ this.maxWidth, this.maxLength ]
    }

    getPieceName(xPos: number, yPos: number): string
    {
        if (!this.isWithinValidRange(xPos, yPos)) return ""
        const piece: Chesspiece | null = this.#getPiece(xPos, yPos)
        if (piece === null) return ""
        return piece.getName()
    }

    getPieceColor(xPos: number, yPos: number): color | null
    {
        if (!this.isWithinValidRange(xPos, yPos)) return null
        const piece: Chesspiece | null = this.#getPiece(xPos, yPos)
        if (piece === null) return null
        return piece.getColor()
    }

    #setPiece(piece: Chesspiece | null, newX: number, newY: number): void
    {
        if (piece !== null)
        {
            piece.setNewPosition(newX, newY)
        }

        const row: Array<Chesspiece|null> = this.#gameBoard[newY] as Array<Chesspiece>
        row[newX] = piece
    }

    #movePiece(piece: Chesspiece, newX: number, newY: number): void
    {
        const [ oldX, oldY ] = piece.getCurrentPosition()
        this.#setPiece(piece, newX, newY)
        this.#setPiece(null, oldX, oldY)
    }

    printBoard()
    {

        console.log("--------------------------------------------------------------------------")
        const board = this.#gameBoard
        for (let i = 0; i < 8; i++)
        {
            let str = ""
            for (let j = 0; j < 8; j++)
            {
                let name: string = board[i]![j]?.getName().split("_")[0] ?? "      "
                while (name.length < 6)
                {
                    name += " "
                }
                str += ` ${name} |`
            }
            console.log(`| ${str}`)
            console.log("--------------------------------------------------------------------------")
        }
    }
}