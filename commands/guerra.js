import axios from 'axios'

let handler = async (m, { conn }) => {
  try {
    const url = global.clashRoyale.baseUrl + global.clashRoyale.currentWarEndpoint

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${global.clashRoyale.apiKey}`
      }
    })

    const war = res.data

    // Estado de la guerra
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

    // Fecha legible
    const finGuerra = new Date(war.warEndTime).toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short'
    })

    // Número de participantes (suponiendo que war.clans[0].members existe)
    const participantes = war.clans?.reduce((acc, clan) => acc + (clan.members?.length || 0), 0) || 'N/A'

    let texto = `🏰 *Guerra del Clan*\n\n`
    texto += `📌 Estado: ${estado}\n`
    texto += `👥 Participantes: ${participantes}\n`
    texto += `⏳ Fin de guerra: ${finGuerra}\n`

    await conn.sendMessage(m.chat, { text: texto }, { quoted: m })

  } catch (err) {
    if (!err.response) {
      return conn.sendMessage(m.chat, { text: '❌ Error de conexión con Clash Royale' }, { quoted: m })
    }

    switch (err.response.status) {
      case 400:
        conn.sendMessage(m.chat, { text: '❌ Petición incorrecta (400)' }, { quoted: m })
        break
      case 403:
        conn.sendMessage(m.chat, { text: '❌ Acceso denegado (IP o token inválido)' }, { quoted: m })
        break
      case 404:
        conn.sendMessage(m.chat, { text: '❌ Clan no encontrado' }, { quoted: m })
        break
      case 429:
        conn.sendMessage(m.chat, { text: '❌ Límite de peticiones alcanzado' }, { quoted: m })
        break
      case 503:
        conn.sen
