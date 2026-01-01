import { expect, test } from "vitest"
import Bishop from "../../../lib/chessEngine/bishop.ts"

function generateBoard()
{
    const board  = new Array(8).fill(null)
    for (let i = 0; i < 8; i++)
    {
        board[i] = (new Array(8).fill(null))
    }
    return board
}

function test_bishop_1()
{
    const bishop = new Bishop(3, 3, "dark")
    const rv = bishop.isPositionValid(5, 5)
    expect(rv).toBe(true)
}

function test_bishop_2()
{
    const bishop = new Bishop(3, 3, "dark")
    const rv = bishop.isPositionValid(1, 1)
    expect(rv).toBe(true)
}

function test_bishop_3()
{
    const bishop = new Bishop(3, 3, "dark")
    const rv = bishop.isPositionValid(5, 1)
    expect(rv).toBe(true)
}

function test_bishop_4()
{
    const bishop = new Bishop(3, 3, "dark")
    const rv = bishop.isPositionValid(1, 5)
    expect(rv).toBe(true)
}

function test_bishop_5()
{
    const bishop = new Bishop(3, 3, "dark")
    const rv = bishop.isPositionValid(3, 3)
    expect(rv).toBe(false)
}

function test_bishop_6()
{
    const bishop = new Bishop(3, 3, "dark")
    const rv = bishop.isPositionValid(5, 8)
    expect(rv).toBe(false)
}

function test_bishop_7()
{
    // Setup:
    const bishop = new Bishop(3, 3, "dark")
    
    const board  = generateBoard()
    board[3][3] = bishop

    // Test:
    const rv = bishop.checkJumpedSquares(board, 5, 5)

    // Results:
    expect(rv).toBe(true)
}

function test_bishop_8()
{
    // Setup:
    const bishop     = new Bishop(3, 3, "dark")
    const tempBishop = new Bishop(6, 6, "dark")

    const board = generateBoard()
    board[3][3] = bishop
    board[6][6] = tempBishop

    // Test:
    const rv = bishop.checkJumpedSquares(board, 6, 6)

    // Results:
    expect(rv).toBe(true)
}

function test_bishop_9()
{
    // Setup:
    const bishop     = new Bishop(3, 3, "dark")
    const tempBishop = new Bishop(7, 7, "dark")
    
    const board = generateBoard()
    board[3][3] = bishop
    board[7][7] = tempBishop

    // Test:
    const rv = bishop.checkJumpedSquares(board, 5, 5)

    // Results:
    expect(rv).toBe(true)
}

function test_bishop_10()
{
    // Setup:
    const bishop     = new Bishop(3, 3, "dark")
    const tempBishop = new Bishop(4, 4, "dark")
    
    const board = generateBoard()
    board[3][3] = bishop
    board[4][4] = tempBishop

    // Test:
    const rv = bishop.checkJumpedSquares(board, 7, 7)

    // Results:
    expect(rv).toBe(false)
}

test("isPositionValid: Moving North-East by 2.", test_bishop_1)
test("isPositionValid: Moving North-West by 2.", test_bishop_4)
test("isPositionValid: Moving South-West by 2.", test_bishop_2)
test("isPositionValid: Moving South-East by 2.", test_bishop_3)
test("isPositionValid: Moving to an invalid position.", test_bishop_5)
test("isPositionValid: Moving North by 5 and East by 2.", test_bishop_6)
test("checkJumpedSquares: Jumping in a board without any other pieces.", test_bishop_7)
test("checkJumpedSquares: Check that you can move to a new position with a piece at the new spot.", test_bishop_8)
test("checkJumpedSquares: Not jumping over a piece but 2 pieces exist in the board.", test_bishop_9)
test("checkJumpedSquares: Jumping over a piece.", test_bishop_10)
