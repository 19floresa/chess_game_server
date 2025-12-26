import { Router } from "express"
import gameSearch from "../controllers/gameControllers.ts"

const router = Router()

router.post("/search", gameSearch)

export default router