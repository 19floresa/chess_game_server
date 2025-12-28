import { Bishop } from "./bishop.ts"
import { Chesspiece } from "./chesspiece.ts"
import { Knight } from "./knight.ts"
import { type playerProp, Player } from "./player.ts"
import { Queen } from "./queen.ts"
import { Rook } from "./rook.ts"

export default class Chessboard 
{
    readonly maxLength: number = 8
    readonly maxWidth: number = 8

    #player1: Player  // black player (dark)
    #player2: Player  // white player (light)

    #currentPlayer: string
    #gameBoard: Chesspiece[][]

    constructor()
    {
        this.#player1 = new Player("dark")
        this.#player2 = new Player("light")
        this.#currentPlayer = "light"

        this.#gameBoard = new Array(this.maxLength)
        for (let i = 0; i < this.maxLength; i++)
        {
            this.#gameBoard[i] = new Array(this.maxWidth).fill(null)
        }

        for (const piece of this.#player1.getAllPieces())
        {
            const [ x, y ] = piece.getCurrentPosition()
            this.#gameBoard[y][x] = piece
        }

        for (const piece of this.#player2.getAllPieces())
        {
            const [ x, y ] = piece.getCurrentPosition()
            this.#gameBoard[y][x] = piece
        }
    }
    
    isWithinValidRange(newX: number, newY: number): boolean 
    {
        const [ maxWidth, maxLength ] = this.getBoardDimensions()
        const [ minWidth, minLength ] = [ 0, 0 ]
        const xValid = ((newX >= minWidth) && (newX < maxWidth))
        const yValid = ((newY >= minLength) && (newY < maxLength))
        return (xValid && yValid)
    }

    getBoardDimensions(): [ number, number]
    {
        return [ this.maxWidth, this.maxLength ]
    }

    getPieceName(xPos: number, yPos: number): string
    {
        if (!this.isWithinValidRange(xPos, yPos)) return ""
        const piece: Chesspiece = this.#gameBoard[yPos][xPos]
        if (piece === null) return ""
        return piece.getName()
    }

    getPieceColor(xPos: number, yPos: number): string
    {
        if (!this.isWithinValidRange(xPos, yPos)) return ""
        const piece: Chesspiece = this.#gameBoard[yPos][xPos]
        if (piece === null) return ""
        return piece.getColor()
    }

    changePlayer()
    {
        this.#currentPlayer = (this.#currentPlayer === "dark") ?  "light" : "dark"
    }

    getCurrentPlayer(): string
    {
        return this.#currentPlayer
    }

    #getPlayer(color: string)
    {
        return (color === "dark") ? this.#player1 : this.#player2
    }

    #getPiece(xPos: number, yPos: number): Chesspiece
    {
        return this.#gameBoard[yPos][xPos]
    }

    #setPiece(piece: Chesspiece, newX: number, newY: number): void
    {
        const [ oldX, oldY ] = piece.getCurrentPosition()
        piece.setNewPosition(newX, newY)
        this.#gameBoard[oldY][oldX] = null
        this.#gameBoard[newY][newX] = piece
    }

    #checkNewSquare(playerColor: string, newX: number, newY: number)
    {
        const piece: Chesspiece = this.#getPiece(newX, newY)
        // TODO: Check that king wont be put in check
        return ((piece === null) || (piece.getColor() !== playerColor))
    }

    #checkSquaresJumped(piece: Chesspiece, newX: number, newY: number): boolean
    {
        return piece.checkJumpedSquares(this.#gameBoard, newX, newY)
    }

    move({ oldX, oldY, 
           newX, newY }: { oldX: number, oldY: number, 
                           newX: number, newY: number }): boolean
    {
        if (!this.isWithinValidRange(newX, newY)) return false
        if (!this.isWithinValidRange(oldX, oldY)) return false

        const piece: Chesspiece = this.#getPiece(oldX, oldY)
        const playerColor: string = this.getCurrentPlayer()
       
        if (piece === null)                                 return false // ignore empty squares
        if (playerColor !== piece.getColor())               return false // Cant move pieces from other player
        if (!piece.move(newX, newY))                        return false // ignore invalid moves
        if (!this.#checkNewSquare(playerColor, newX, newY)) return false // Dont move to square of our pieces
        if (!this.#checkSquaresJumped(piece, newX, newY))   return false // Check all squares jumped over are empty

        const oldPiece: Chesspiece = this.#getPiece(newX, newY)
        if (oldPiece !== null) // remove piece from player
        {
            const otherPlayerColor: string = (playerColor === "dark") ?  "light" : "dark"
            const otherPlayer: Player =  this.#getPlayer(otherPlayerColor)
            otherPlayer.removePiece(oldPiece)
            console.log(`Removed: ${oldPiece.getName()}`)
        }

        this.#setPiece(piece, newX, newY)
        this.changePlayer()

        const [ targetName, targetColor] = piece.getName().split("_")
        if ((targetName === "pawn"))
        {
            if ((targetColor === "dark") && (newY === 7))   
            {
                this.#promote(newX, newY)
            }
            else if ((targetColor === "light") && (newY === 0))
            {
                this.#promote(newX, newY)
            }
        } 
        
        // TODO: win condition
        // TODO: stalement
        return true
    }

    #promote(x: number, y: number)
    {
        const piece: Chesspiece = this.#getPiece(x, y)
        const color: string = piece.getColor()
        let val: string = ""
        let n: number = -1
        while(true)
        {
            val = prompt("Promote Pawn: Queen (1), Rook (2), Bishop (3), Knight (4):")
            n = Number(val)
            if ((n > 0) && (n < 5)) break
        }

        let newPiece: Chesspiece = null
        switch(n)
        {
            case 1:
                newPiece = new Queen(x, y, color)
                break
            case 2:
                newPiece = new Rook(x, y, color)
                break
            case 3:
                newPiece = new Bishop(x, y, color)
                break
            case 4:
                newPiece = new Knight(x, y, color)
                break
            default:
                throw Error(`Pawn pronotion is not valid. ${n}`)
        }

        const player: Player = this.#getPlayer(color)
        player.removePiece(piece)
        player.addPiece(newPiece)
        this.#gameBoard[y][x] = newPiece
    }
}