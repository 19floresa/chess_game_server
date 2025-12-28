
const dark: string = "dark"
const light: string = "light"

export abstract class Chesspiece {
    
    #xPos: number = -1
    #yPos: number = -1
    #color: string = ""
    #name: string = ""

    constructor(newX: number, newY: number, color: string)
    {
        this.setNewPosition(newX, newY)
        this.setColor(color)
        this.#setName()
    }

    #setName(): void
    {
        this.#name = `${this.constructor.name.toLowerCase()}_${this.#color}`
    }

    getName(): string
    {
        return this.#name
    }

    setColor(color: string): void
    {
        const c = color.toLowerCase()
        if (c === dark || c === light)
        {
            this.#color = c
        }
        else
        {
            throw Error("Invalid color.")
        }
    }

    setNewPosition(newX: number, newY: number)
    {
        this.#xPos = newX
        this.#yPos = newY
    }

    getCurrentPosition(): [ number, number ]
    {
        return [ this.#xPos, this.#yPos ]
    }
    
    getColor(): string
    {
        return this.#color
    }

    isWithinValidRange(newX: number, newY: number): boolean 
    {
        const [ maxWidth, maxLength ] = [ 8, 8 ] // TODO: Fix
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
        const color = this.getColor()
        let xDif: number = 0
        let yDif: number = 0
        if (color === light)
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

    move(newX: number, newY: number): boolean 
    {
        const isValidRange:   boolean = this.isWithinValidRange(newX, newY)
        const isMoving:    boolean = this.isMoving(newX, newY)
        const isNewMoveValid: boolean = this.isPositionValid(newX, newY)
        return isValidRange && isMoving && isNewMoveValid
    }

    abstract isPositionValid(newX: number, newY: number): boolean
    abstract checkJumpedSquares(gameBoard: Chesspiece[][], newX: number, newY: number): boolean
}