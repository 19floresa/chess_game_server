import dotenv from "dotenv"

dotenv.config()

interface Config {
    port: number      // Port number of service
    dbPort: number    // Port number to db service
    nodeEnv: string   // Environment
    url: string       // Address to GUI service
}

const config: Config = {
    port: 0,
    dbPort: 0,
    nodeEnv: process.env.NODE_ENV || "development",
    url: ""
}

// Overwrite for Test and development environments
if (config.nodeEnv !== "production")
{
    config.port   = 3056
    config.dbPort = 3078
    config.url    = "http://localhost:3000"
}
else
{
    config.port   = Number(process.env.GAME_PORT) || 3056
    config.dbPort = Number(process.env.DB_PORT) || 3078
    config.url    = `${process.env.URL}:${process.env.GUI_PORT}`
}

export default config