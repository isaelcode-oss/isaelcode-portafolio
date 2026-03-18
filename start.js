import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

const cwd = __dirname
const vite = join(cwd, 'node_modules', '.bin', 'vite.cmd')

const child = spawn(vite, ['--port', '5174'], { cwd, stdio: 'inherit', shell: true })
child.on('error', (e) => { console.error(e); process.exit(1) })
