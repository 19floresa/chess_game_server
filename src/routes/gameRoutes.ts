import { Router } from "express"
import { gameSearch, gameMove } from "../controllers/gameControllers.ts"

const router = Router()

router.post("/search", gameSearch)
router.post("/move", gameMove)

export default router