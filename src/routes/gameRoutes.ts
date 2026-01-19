import { Router } from "express"
import gameSearch from "../controllers/gameController.ts"
import replayGame from "../controllers/replayController.ts"

const router = Router()

router.post("/search", gameSearch)
router.post("/replay", replayGame)

export default router