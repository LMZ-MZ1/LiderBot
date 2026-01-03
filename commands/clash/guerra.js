import axios from 'axios'

export default {
  command: ['guerra'],
  category: 'clash',
  run: async (client, m, args, command) => {
    try {
      const url = `${global.clashRoyale.baseUrl}${global.clashRoyale.currentWarEndpoint}`
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${global.clashRoyale.apiKey}` }
      })

      const war = res.data

      let estado
      switch (war.state) {
        case 'collectionDay':
          estado = 'Dia de coleccion'
          break
        case 'warDay':
          estado = 'Dia de guerra'
          break
        default:
          estado = war.state
      }

      let texto = 'Guerra del Clan\n\n'
      texto += `Estado: ${estado}\n`
      texto += `Participantes: ${war.participants?.length || 0}\n`
      texto += `Fin de guerra: ${war.warEndTime || 'Desconocido'}\n`

      await client.sendMessage(
        m.chat,
        { text: texto },
        { quoted: m }
      )

    } catch (err) {
      if (!err.response) {
        return client.reply(m.chat, 'Error de conexion con Clash Royale', m)
      }

      const errores = {
        400: 'Peticion incorrecta (400)',
        403: 'Acceso denegado (IP o token invalido)',
        404: 'Clan no encontrado',
        429: 'Limite de peticiones alcanzado',
        503: 'API en mantenimiento'
      }

      const mensaje = errores[err.response.status] || 'Error desconocido de la API'
      await client.reply(m.chat, mensaje, m)
    }
  }
}
