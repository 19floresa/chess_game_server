import { expect, test } from "vitest"
import Pawn from "../../../lib/chessEngine/pawn.ts"
import color from "../../../lib/types/color.ts"

function test_pawn_1()
{
    const pawn = new Pawn(3, 3, color.dark)
    const rv = pawn.isPositionValid(3, 5)
    expect(rv).toBe(true)
}

function test_pawn_2()
{
    const pawn = new Pawn(3, 3, color.dark)
    const rv = pawn.isPositionValid(3, 4)
    expect(rv).toBe(true)
}

function test_pawn_3()
{
    const pawn = new Pawn(3, 3, color.light)
    const rv = pawn.isPositionValid(3, 1)
    expect(rv).toBe(true)
}

function test_pawn_4()
{
    const pawn = new Pawn(3, 3, color.light)
    const rv = pawn.isPositionValid(3, 2)
    expect(rv).toBe(true)
}

function test_pawn_5()
{
    const pawn1 = new Pawn(3, 3, color.dark)
    const pawn2 = new Pawn(4, 4, color.light)
    const rv = pawn1.isPositionValid(4, 4)
    expect(rv).toBe(true)
}

function test_pawn_6()
{
    const pawn1 = new Pawn(3, 3, color.light)
    const rv = pawn1.isPositionValid(3, 5)
    expect(rv).toBe(false)
}

test("isPositionValid: Move forward 2 steps (dark)", test_pawn_1)
test("isPositionValid: Move forward 1 steps (dark)", test_pawn_2)
test("isPositionValid: Move forward 2 steps (light)", test_pawn_3)
test("isPositionValid: Move forward 1 steps (light)", test_pawn_4)
test("isPositionValid: Capture Piece (dark)", test_pawn_5)
test("isPositionValid: Move to invalid position (light)", test_pawn_6)