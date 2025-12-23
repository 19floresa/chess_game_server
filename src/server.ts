import httpServer from "./socket.ts"
import config from "./config/config.ts"


httpServer.listen(config.port, () => console.log(`Server listening on port ${config.port}`))
