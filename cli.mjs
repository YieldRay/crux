import process from 'node:process'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { add } from './crux.mjs'

function help() {
    process.stdout
        .write(`\x1b[32mcrux\x1b[0m - Hosting small (≤ 20kB) deno scripts to crux.land

\x1b[1mUsage:\x1b[0m
    crux <file>   # from path
    crux < <file> # from stdin
\x1b[1mFlags:\x1b[0m
    --help, -h    Print this help
    --name, -n    Used for specify extension
`)
    process.exit(1)
}

// https://nodejs.org/api/util.html#utilparseargsconfig
const { values, positionals } = parseArgs({
    options: {
        help: {
            type: 'boolean',
            multiple: false,
            short: 'h',
            default: false,
        },
        name: {
            type: 'string',
            short: 'n',
        },
    },
    strict: true,
    allowPositionals: true,
})

function main() {
    if (positionals[0]) {
        const filepath = positionals[0]
        const buf = readFileSync(filepath)
        return add(buf, values.name || filepath)
    } else if (!process.stdin.isTTY) {
        const buf = readFileSync(process.stdin.fd)
        if (buf.byteLength === 0) {
            console.error('stdin is empty')
            process.exit(-1)
        }
        return add(buf, values.name || 'stdin.js')
    } else {
        help()
    }
}

try {
    const url = await main()
    console.log(url)
} catch (e) {
    console.error(e.message)
    process.exit(-1)
}
