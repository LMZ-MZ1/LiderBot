import cron from 'node-cron'

export default function warReminder(client) {
  const grupoId = '120363149228419135@g.us'

  const mensajes = [
    '⚔️🛡️ ¡GUERRA DEL CLAN! No olviden atacar 💥',
    '🔥⚔️ ¡Hora de la guerra! Vamos equipo',
    '🛡️⚔️ Últimos ataques, ¡a darlo todo!'
  ]

  console.log('⏰ Recordatorios activos (todos los días 7:40–8:00 pm)')

  cron.schedule(
    '40,43,46,49,52,55,58 19 * * *',
    async () => {
      const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)]
      try {
        await client.sendMessage(grupoId, { text: mensaje })
        console.log('✅ Recordatorio enviado')
      } catch (e) {
        console.error('❌ Error enviando recordatorio:', e)
      }
    },
    {
      timezone: 'America/Mexico_City'
    }
  )
}