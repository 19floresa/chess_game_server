export default async function postFetch(data: any, cmd: string): Promise< [ number, any ] >
{
    const res = await fetch(`http://app:3078/database/${cmd}`, 
    { 
        method: 'POST', 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const body: any = await res.json()
    return [ res.status, body ]
}