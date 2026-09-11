import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Recuperamos la carpeta a listar
const dir = process.argv[2] ?? '.'

// Recuperamos los flags
const flags = process.argv.slice(3)

const filesOnly = flags.includes('--files-only')
const dirsOnly = flags.includes('--dirs-only')

// Formateo simple de los tamaños
const formatBytes = (size) => {
  if (size < 1024) return `${size} B`

  return `${(size / 1024).toFixed(2)} KB`
}

// Leemos los nombres
const files = await readdir(dir)

// Recuperamos la info de cada file
let entries = await Promise.all(
  files.map(async (name) => {
    const fullPath = join(dir, name)
    const info = await stat(fullPath)

    return {
      name,
      isDir: info.isDirectory(),
      size: formatBytes(info.size)
    }
  })
)

// Filtramos según los flags
if (filesOnly) {
  entries = entries.filter((entry) => !entry.isDir)
}

if (dirsOnly) {
  entries = entries.filter((entry) => entry.isDir)
}

// Ordenamos primero las carpetas, luego alfabeticamente
entries.sort((a, b) => {
  if (a.isDir !== b.isDir) {
    return a.isDir ? -1 : 1
  }

  return a.name.localeCompare(b.name)
})

// Renderizamos la información
for (const entry of entries) {
  const icon = entry.isDir ? '📁' : '📄'
  const size = entry.isDir ? '---' : entry.size

  console.log(`${icon} ${entry.name.padEnd(25)} ${size}`)
}
