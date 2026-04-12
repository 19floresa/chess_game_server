import dotenv from "dotenv"

dotenv.config()

interface Config {
    port: number
    nodeEnv: string
    url: string
}

const config: Config = {
    port: Number(process.env.PORT) || 3056,
    nodeEnv: process.env.NODE_ENV || "development",
    url: process.env.URL || "http://localhost:3000"
}

// Overwrite for Test and development environments
if (config.nodeEnv !== "production")
{
    config.port = 3056
    config.url = "http://localhost:3000"
}

export default config