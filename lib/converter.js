import { promises as fs, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      // ESTO CREA LA CARPETA TMP SI NO EXISTE
      const tmpDir = join(process.cwd(), 'tmp')
      if (!existsSync(tmpDir)) mkdirSync(tmpDir)

      let tmp = join(tmpDir, + new Date + '.' + ext)
      let out = tmp + '.' + ext2
      await fs.writeFile(tmp, buffer)

      exec(`ffmpeg -i ${tmp} ${args.join(' ')} ${out}`, async (e) => {
        try {
          if (existsSync(tmp)) await fs.unlink(tmp)
          if (e) return reject(e)
          let buff = await fs.readFile(out)
          if (existsSync(out)) await fs.unlink(out)
          resolve(buff)
        } catch (e) {
          reject(e)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

export function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus')
}