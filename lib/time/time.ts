export function generateTimeUTC(): string
{
    const date = new Date()
    return date.toUTCString()
}