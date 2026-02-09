import color from "../types/color.ts"

export default abstract class Chesspiece {
    
    #xPos: number = -1
    #yPos: number = -1
    #color: color = color.light
    #name: string = ""

    constructor(newX: number, newY: number, color: color)
    {
        this.setNewPosition(newX, newY)
        this.setColor(color)
        this.#setName()
    }

    move(newX: number, newY: number): boolean 
    {
        const isValidRange: boolean = this.isWithinValidRange(newX, newY)
        const isMoving: boolean = this.isMoving(newX, newY)
        const isNewMoveValid: boolean = this.isPositionValid(newX, newY)
        return isValidRange && isMoving && isNewMoveValid
    }

    isWithinValidRange(newX: number, newY: number): boolean 
    {
        const [ maxWidth, maxLength ] = [ 8, 8 ]
        const [ minWidth, minLength ] = [ 0, 0 ]
        const xValid = ((newX >= minWidth) && (newX < maxWidth))
        const yValid = ((newY >= minLength) && (newY < maxLength))
        return (xValid && yValid)
    }

    isMoving(newX: number, newY: number): boolean 
    {
        const [ xDif, yDif ] = this.calcPosDiffByGreater(newX, newY)
        return !((xDif === 0) && (yDif === 0))
    }

    calcPosDiffByGreater(newX: number, newY: number): [ number, number]
    {
        const [ x, y ] = this.getCurrentPosition()
        let xDif: number = 0
        let yDif: number = 0
        if (newX < x)
        {
            xDif = x - newX
        }
        else
        {
            xDif = newX - x
        }

        if (newY < y)
        {
            yDif = y - newY
        }
        else
        {
            yDif = newY - y
        }

        return [ xDif, yDif ]
    }

    calcPosDiffByColor(newX: number, newY: number): [ number, number]
    {
        const [ x, y ] = this.getCurrentPosition()
        const c: color = this.getColor()
        let xDif: number = 0
        let yDif: number = 0
        if (c === color.light)
        {
            xDif = x - newX
            yDif = y - newY
        }
        else
        {
            xDif = newX - x
            yDif = newY - y
        }
        return [ xDif, yDif ]
    }

    calcPosDiff(newX: number, newY: number): [ number, number]
    {
        const [ x, y ] = this.getCurrentPosition()
        const xDif: number = x - newX
        const yDif: number = y - newY
        return [ xDif, yDif ]
    }

    getName(): string
    {
        return this.#name
    }
    
    getColor(): color
    {
        return this.#color
    }

    getCurrentPosition(): [ number, number ]
    {
        return [ this.#xPos, this.#yPos ]
    }

    getBoardPiece(board: Array<Array<Chesspiece|null>>, x: number, y: number): Chesspiece | null
    {
        // NOTE: Will always be within board but typescript complains :(
        const row: Array<Chesspiece|null> = board[y] as Array<Chesspiece|null>
        const piece: Chesspiece | null = row[x]!
        return piece
    }

    #setName(): void
    {
        const c: string = color[this.getColor()]
        this.#name = `${this.constructor.name.toLowerCase()}_${c}`
    }

    setColor(color: color): void
    {
        this.#color = color
    }

    setNewPosition(newX: number, newY: number)
    {
        this.#xPos = newX
        this.#yPos = newY
    }

    abstract isPositionValid(newX: number, newY: number): boolean
    abstract checkJumpedSquares(gameBoard: Array<Array<Chesspiece|null>>, newX: number, newY: number): boolean
}