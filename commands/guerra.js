/*
 # ------------√ ×------------
    # Agradecimientos :: LMZ

    - Recuerda dejar los creditos, no quites los creditos de los autores del código!
    - Puedes modificar esta base a tu gusto, recuerda dejar los creditos correspondiente!
 # ------------√ ×------------
*/import axios from 'axios'

let handler = async (m, { conn }) => {
  try {
    const url = `${global.clashRoyale.baseUrl}/clans/${global.clashRoyale.clanTag}/currentwar`

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${global.clashRoyale.apiKey}`
      }
    })

    const war = res.data

    let estado
    switch (war.state) {
      case 'collectionDay':
        estado = '📦 Día de colección'
        break
      case 'warDay':
        estado = '⚔️ Día de guerra'
        break
      default:
        estado = war.state
    }

    let texto = `🏰 *Guerra del Clan*\n\n`
    texto += `📌 Estado: ${estado}\n`
    texto += `👥 Participantes: ${war.participants.length}\n`
    texto += `⏳ Fin de guerra: ${war.warEndTime}\n`

    m.reply(texto)

  } catch (err) {
    if (!err.response) {
      return m.reply('❌ Error de conexión con Clash Royale')
    }

    switch (err.response.status) {
      case 400:
        m.reply('❌ Petición incorrecta (400)')
        break
      case 403:
        m.reply('❌ Acceso denegado (IP o token inválido)')
        break
      case 404:
        m.reply('❌ Clan no encontrado')
        break
      case 429:
        m.reply('❌ Límite de peticiones alcanzado')
        break
      case 503:
        m.reply('⚠️ API en mantenimiento')
        break
      default:
        m.reply('❌ Error desconocido de la API')
    }
  }
}

handler.command = ['guerra']
handler.tags = ['clash']
handler.help = ['guerra']

export default handler
