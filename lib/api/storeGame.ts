import postFetch from "../../lib/api/postFetch.ts"
import type gameInfo from "../types/gameInfo.ts"
import state from "../types/state.ts"

export default async function storeGame(game: gameInfo)
{
    const { idP1, idP2, idWinner, timeStarted, timeCompleted, status, gameHistory} = game
    await postFetch(
    {
        idLight: idP1,
        idDark: idP2,
        idWinner: idWinner,
        start: timeStarted,
        end: timeCompleted,
        status: state[status],
        gameSteps: gameHistory
    }, "game")
}