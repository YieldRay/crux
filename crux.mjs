import { extname } from 'node:path'

/**
 * @param {Uint8Array} code
 */
export async function add(code, name = 'script.js') {
    const res = await fetch('https://crux.land/api/add', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            name: ['ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mts', 'mjs'].some(
                (ext) => name.endsWith(`.${ext}`)
            )
                ? name
                : `${name}.js`,
            content: btoa(String.fromCodePoint(...code)),
        }),
    })
    const ext = extname(name).slice(1) || 'js'
    const json = await res.json()
    if (json.error) {
        const match = json.error.match(/File already exists \((\w+)\)/)
        if (match && match[1]) {
            return `https://crux.land/api/get/${match[1]}.${ext}`
        } else {
            throw new Error(json.error)
        }
    }
    return `https://crux.land/api/get/${json.id}.${ext}`
}
