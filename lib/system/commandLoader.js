import fs from "fs"
import path from "path"
import chalk from "chalk"
import { fileURLToPath, pathToFileURL } from "url"
import syntaxerror from "syntax-error"
import { format } from "util"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

global.middlewares = { before: [], after: [] }
global.comandos = new Map()
global.plugins = {}

const commandsFolder = path.join(__dirname, "../../commands")

async function loadCommandsAndPlugins(dir = commandsFolder) {
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)

    if (fs.lstatSync(fullPath).isDirectory()) {
      await loadCommandsAndPlugins(fullPath)
      continue
    }

    if (!item.endsWith(".js")) continue

    const code = fs.readFileSync(fullPath)
    const err = syntaxerror(code, item, {
      sourceType: "module",
      allowAwaitOutsideFunction: true
    })

    if (err) {
      console.error(chalk.red(`❌ Error de sintaxis en ${item}:\n${format(err)}`))
      continue
    }

    try {
      const moduleURL =
        pathToFileURL(path.resolve(fullPath)).href +
        `?update=${Date.now()}`

      const imported = await import(moduleURL)
      const comando = imported.default
      const pluginName = item.replace(".js", "")

      global.plugins[pluginName] = imported

      if (typeof imported.before === "function" && !comando?.command) {
        global.middlewares.before.push(imported.before)
      }

      if (typeof imported.after === "function" && !comando?.command) {
        global.middlewares.after.push(imported.after)
      }

      if (!comando?.command || typeof comando.run !== "function") continue

      comando.command.forEach(cmd => {
        global.comandos.set(cmd.toLowerCase(), {
          pluginName,
          run: comando.run,
          category: comando.category || "uncategorized",
          isOwner: comando.isOwner || false,
          isAdmin: comando.isAdmin || false,
          botAdmin: comando.botAdmin || false,
          isModeration: comando.isModeration || false,
          before: imported.before || null,
          after: imported.after || null,
          info: comando.info || {}
        })
      })
    } catch (e) {
      console.error(chalk.red(`❌ Error en el plugin ${item}:`), e)
    }
  }
}

globalThis.reload = async (_ev, filename) => {
  if (!filename || !filename.endsWith(".js")) return

  const fullPath = path.join(commandsFolder, filename)
  if (!fs.existsSync(fullPath)) return

  try {
    const moduleURL =
      pathToFileURL(path.resolve(fullPath)).href +
      `?update=${Date.now()}`

    const imported = await import(moduleURL)

    global.plugins[filename.replace(".js", "")] = imported.default || imported
    global.comandos.clear()
    global.middlewares.before = []
    global.middlewares.after = []
    await loadCommandsAndPlugins()
  } catch (e) {
    console.error(chalk.red(`❌ Error al recargar ${filename}:`), e)
  }
}

Object.freeze(globalThis.reload)

fs.watch(commandsFolder, (_, filename) => {
  if (filename) globalThis.reload(_, filename)
})

export default loadCommandsAndPlugins
