export function generateTimeUTC()
{
    return Date.now()
}

export function timeToString(timestamp: number): string
{
    const date = new Date(timestamp)
    return date.toString()
}