// import httpServer from "./socket.ts"
// import config from "./config/config.ts"

// httpServer.listen(config.port, () => console.log(`Server listening on port ${config.port}`))

import color from "../lib/types/color.ts"
import Chessboard from "../lib/chessEngine/chessboard.ts"
const board = new Chessboard()
const moves: [ number, number, number, number ][] = 
[ 
    [ 4, 6, 4, 5 ], // light
    [ 4, 1, 4, 3 ], // dark
    [ 3, 7, 5, 5 ], // light
    [ 4, 3, 4, 4 ], // dark
    [ 5, 5, 4, 4 ], // light
    [ 3, 0, 4, 1 ], // dark
     [ 4, 4, 4, 3 ], // light
     [ 4, 0, 3, 0 ], // dark
     [ 0, 6, 0, 5 ], // light
    [ 4, 1, 4, 2 ], // dark
    [ 0, 5, 0, 4 ], // light
    [ 4, 2, 0, 2 ], // dark
    [ 0, 7, 0, 5 ], // light
      [ 7, 1, 7, 2 ], // dark
      [ 0, 5, 3, 5 ], // light
     [ 7, 2, 7, 3 ], // dark
     [ 3, 5, 3, 4 ], // light
     [ 7, 3, 7, 4 ], // dark
     [ 3, 4, 4, 4 ], // light
     [ 0, 2, 2, 4  ], // dark
      [ 4, 3, 4, 0 ], // light
 //    [ 3, 0, 4, 0 ], // dark
]


console.log("Start------------------------------")
const preWinner: color | null = board.getWinner()
console.log(`King in Check: ${preWinner}`)
for (const [ x, y, x2, y2 ] of moves)
{
    const name: string = board.getPieceName(x, y)
    const result: boolean = board.move({ oldX: x, oldY: y, newX: x2, newY: y2 })
    console.log(`${name ?? "null"}: ${result ? "Pass": "Fail"}`)
}

board.printBoard()
const winner: color | null = board.getWinner()
console.log(`King in Check: ${winner}`)
// const [ isKingCheck, culprits ]  = board.isKingInCheck()
// console.log(`Opponent King In check (turn: opponent): ${isKingCheck}`)

// for (const culprit of culprits)
// {
//     console.log(culprit.getName())
// }

console.log("End------------------------------")

