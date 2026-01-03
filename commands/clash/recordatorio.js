import cron from 'node-cron';

export default function warReminder(client) {
  // ID del grupo donde se enviarán los recordatorios
  const grupoId = '120363149228419135@g.us';

  // Horarios: 9:00, 13:00 y 19:00, de jueves a domingo
  const horarios = [
  '0 9 * * 4-7',              // 9:00
  '0 13 * * 4-7',             // 13:00
  '0 14 * * 4-7',             // 14:00
  '13 14 * * 4-7',             // 14:00
  '16 14 * * 4-7',             // 14:00
  '20 14 * * 4-7',             // 14:00
  '22 14 * * 4-7',             // 14:00
  '25 19 * * 4-7'              // 19:00
];

  // Mensajes posibles para más entusiasmo
  const mensajes = [
    '🛡️⚔️ ¡Es hora de las batallas de guerra! Buena suerte, equipo, ¡a darlo todo! ⚔️🛡️',
    '🛡️⚔️ ¡No olviden sus guerras, guerreros! ¡Que las victorias estén de su lado! ⚔️🛡️',
    '🛡️⚔️ ¡Hora de jugar la guerra del clan! Mucha suerte a todos, ¡demuestren su valor! ⚔️🛡️'
  ];

  horarios.forEach(horario => {
    cron.schedule(horario, async () => {
      // Escoge un mensaje aleatorio
      const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];

      try {
        await client.sendMessage(grupoId, { text: mensaje });
        console.log(`Recordatorio enviado al grupo ${grupoId} ✅`);
      } catch (e) {
        console.error('Error enviando recordatorio:', e);
      }
    }, {
      timezone: 'America/Mexico_City' // Hora local de México
    });
  });
}