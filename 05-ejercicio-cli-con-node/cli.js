import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

/* // Recuperamos la carpeta a listar
const dir = process.argv[2] ?? '.'

// Recuperamos los flags
const flags = process.argv.slice(3)

const filesOnly = flags.includes('--files-only')
const dirsOnly = flags.includes('--dirs-only')
*/

// Los flags pueden ir en cualquier posición y el comando puede no llevar directorio, así que separamos flags del primer argumento que no sea flag
const args = process.argv.slice(2)
const flags = args.filter((arg) => arg.startsWith('--'))
const dir = args.find((arg) => !arg.startsWith('--')) ?? '.'

// Ahora que tenemos la lista de los flags, podemos buscar individualmente los que necesitamos
const filesOnly = flags.includes('--files')
const dirsOnly = flags.includes('--folders')

// Formateo simple de los tamaños
const formatBytes = (size) => {
  if (size < 1024) return `${size} B`

  return `${(size / 1024).toFixed(2)} KB`
}

/* // Leemos los nombres
const files = await readdir(dir)
*/

// Evaluamos que el usuario haya puesto los permisos correctos
const userHasPermissions = process.permission?.has('fs.read', dir)

// Si no los tiene, tanto el flag de `--permission` como el `--allow-fs-read` mostramos error y cerramos el proceso en consola
if(!userHasPermissions) {
  console.error(`No tienes permisos para leer el directorio "${dir}". Ejecuta: --permission --allow-fs-read=${dir} ${dir}`)
  process.exit(1)
}

// Envolver la lectura en try/catch para detectar errores en caso de que la carpeta/directorio no exista
let files
try {
  files = await readdir(dir)
} catch (error) {
  if (error.code === 'EACCES') {
    console.error(`No se pudo encontrar el directorio "${dir}"`)
    process.exit(1)
  }

  throw error
}

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

/* // Ordenamos primero las carpetas, luego alfabeticamente
entries.sort((a, b) => {
  if (a.isDir !== b.isDir) {
    return a.isDir ? -1 : 1
  }

  return a.name.localeCompare(b.name)
})
*/

// El ejercicio pide ordenar solo con --asc o --desc y mantener el orden original si no hay flag
if (flags.includes('--asc')) {
  entries.sort((a, b) => a.name.localeCompare(b.name))
} else if (flags.includes('--desc')) {
  entries.sort((a, b) => b.name.localeCompare(a.name))
}

// Renderizamos la información
for (const entry of entries) {
  const icon = entry.isDir ? '📁' : '📄'
  const size = entry.isDir ? '---' : entry.size

  console.log(`${icon} ${entry.name.padEnd(25)} ${size}`)
}
