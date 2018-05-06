import { createHash } from "crypto"

export function getRandomCode(str) {
    let date = new Date()
    let name = `${str}${date.toISOString()}`
    let hash = createHash('md5').update(name).digest('hex')
    return hash
}