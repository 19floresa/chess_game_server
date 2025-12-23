import config from "../../src/config/config.ts"

export function getPort(): number
{
    return config.port
}