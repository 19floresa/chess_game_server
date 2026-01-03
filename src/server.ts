import httpServer from "./socket.ts"
import config from "./config/config.ts"

httpServer.listen(config.port, () => console.log(`Server listening on port ${config.port}`))

// import color from "../lib/types/color.ts"
// import Chessboard from "../lib/chessEngine/chessboard.ts"
// const board = new Chessboard()

// // const moves: [ number, number, number, number ][] = 
// // [ 
// //     [ 1, 7, 2, 5 ], // light
// //     [ 0, 1, 0, 2 ], // dark
// //     [ 2, 5, 3, 3 ], // light
// //     [ 0, 2, 0, 3 ], // dark
// //     //[ 5, 1, 5, 2 ], // dark
// //     [ 3, 3, 2, 1 ], // light
// //     [ 3, 0, 2, 1 ], // dark
// //     //[ 5, 1, 5, 2 ], // dark
// // ]

// const moves: [ number, number, number, number ][] = 
// [ 
//     [ 1, 7, 2, 5 ], // light
//     [ 0, 1, 0, 2 ], // dark
//     [ 2, 5, 3, 3 ], // light
//     [ 0, 2, 0, 3 ], // dark
//     //[ 5, 1, 5, 2 ], // dark
//     [ 3, 3, 2, 1 ], // light
//     [ 3, 0, 2, 1 ], // dark
//     //[ 5, 1, 5, 2 ], // dark
// ]
// for (const [ x, y, x2, y2 ] of moves)
// {
//     const name: string = board.getPieceName(x, y)
//     const result: boolean = board.move({ oldX: x, oldY: y, newX: x2, newY: y2 })
//     console.log(`${name ?? "null"}: ${result}`)
//     if (result === true) board.printBoard()
// }

// const winner: color | null = board.getWinner()
// console.log(color[winner])
