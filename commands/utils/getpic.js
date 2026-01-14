import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['pfp', 'getpic'],
  category: 'utils',
  run: async (client, m) => {
    let who2

    // 1️⃣ En grupos: mención
    if (m.isGroup && m.mentionedJid?.length) {
      who2 = m.mentionedJid[0]
    }
    // 2️⃣ Mensaje citado
    else if (m.quoted) {
      who2 = m.quoted.sender
    }
    // 3️⃣ Chat privado → la otra persona
    else if (!m.isGroup) {
      who2 = m.chat
    }

    if (!who2)
      return m.reply('🍒 Menciona o responde a alguien para obtener su foto de perfil.')

    try {
      const who = await resolveLidToRealJid(who2, client, m.chat)
      const img = await client.profilePictureUrl(who, 'image').catch(() => null)

      if (!img)
        return m.reply('🦩 No se pudo obtener la foto de perfil.')

      await client.sendMessage(
        m.chat,
        { image: { url: img } },
        { quoted: m }
      )
    } catch (e) {
      console.error(e)
      m.reply('🌱 Error al obtener la foto de perfil.')
    }
  }
}
