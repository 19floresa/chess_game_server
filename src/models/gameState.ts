import { generateTimeUTC } from "../../../lib/time/time.ts"
//import { bst } from "../../../lib/bst/bst.ts"

export interface gameState {
    userIdLight: number;
    userIdDark: number;
    gameId: number;
    gameHistory: [];
    timeStarted: number;
    timeCompleted: number;
}

const gameSearching: Array<gameState> = []
const gameActive: Record<number, gameState> = {}
const gamesAll: Record<number, gameState> = {}

/**
 * This function generate a game ID between the range specified below: [ min to max ]
 * @returns New game ID
 */
function gameGenerateId(): number
{
    const min = 0x112233445566
    const max = 0xFFFFFFFFFFFF
    while (true)
    {
        const gameId = Math.floor( Math.random() * ((max - min) + min) )
        const game = gameSearchFind(gameId)
        if (game === null)
        {
            return gameId
        }
    }
}

export function gameNew(userIdLight: number): gameState
{
    const gameId = gameGenerateId()
    const timeStarted = generateTimeUTC()
    const gameInfo: gameState =
    {
    userIdLight,
    userIdDark: -1,
    gameId,
    gameHistory: [],
    timeStarted,
    timeCompleted: -1
    }
    return gameInfo
}

export function gameSearchFind(gameId: number): gameState | null
{
    for (const game of gameSearching)
    {
        if (gameId === game.gameId)
        {
            return game
        }
    }
    return null
}

// export function gameSearchRemove(gameId: number): void
// {
//     const games: Array<gameState> = gameSearching.filter((item: gameState) => gameId !== item.gameId)
//     gameSearch = games
// }

export function gameSearchAdd(game: gameState): void
{
    gameSearching.push(game)
}

// export function gameActiveRemove(gameId: number): boolean
// {
//     const
// }

export function gameActiveFind(userId: number): gameState | null
{

    const game: gameState | undefined = gameActive[userId]
    return game === undefined ? null : game
}

export function gameActiveAdd(game: gameState, userId: number): void
{
    gameActive[userId] = game
}

export function gameAllAdd(game: gameState): void
{
    const gameId = game.gameId
    gamesAll[gameId] = game
}

export function gameAllFind(gameId: number): gameState | null
{
    const game: gameState | undefined = gamesAll[gameId]
    return game === undefined ? null : game
}

// let root: bst = new bst(7, null)
// root.add(2, null)
// root.add(3, null)
// root.add(9, null)
// root.add(8, null)
// root.add(10, null)
// console.log(root.inorderTraversal())
// Delete all
// root = root.delete(10)
// root = root.delete(8)
// root = root.delete(9)
// root = root.delete(3)
// root = root.delete(2)
// Delete root
// root = root.delete(7)
// console.log(root.inorderTraversal())
// root = root.delete(8)
//console.log(root.inorderTraversal())