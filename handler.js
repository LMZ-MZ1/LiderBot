/*
 # ------------√ ×------------
    # Agradecimientos :: ZyxlJs
    # Agradecimientos :: Destroy
    # Agradecimientos :: AzamiJs
    # Agradecimientos :: GataDios

    - Recuerda dejar los creditos, no quites los creditos de los autores del código!
    - Puedes modificar esta base a tu gusto, recuerda dejar los creditos correspondiente!
 # ------------√ ×------------
*/

import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import antilink from './commands/antilink.js';
import level from './commands/level.js';
import { getGroupAdmins } from './lib/message.js';
import warReminder from './commands/clash/recordatorio.js';

export default function initHandler(client) {
  // 1️⃣ Inicialización al iniciar el bot
  client.on('ready', () => {
    warReminder(client); // activa los recordatorios
    console.log('Recordatorios de guerra programados ✅');
  });

  // 2️⃣ Cargar comandos
  seeCommands();

  // 3️⃣ Manejar mensajes entrantes
  client.on('message', async (m) => {
    if (!m.message) return;

    const sender = m.sender;
    let body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      m.message.buttonsResponseMessage?.selectedButtonId ||
      m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
      m.message.templateButtonReplyMessage?.selectedId ||
      '';

    // Inicializa DB y funciones
    initDB(m, client);
    antilink(client, m);

    // -----------------------------
    // Prefijos y parsing de comando
    // -----------------------------
    const from = m.key.remoteJid;
    const idDD = client.user.id.split(':')[0] + "@s.whatsapp.net" || '';
    const rawPrefijo = global.db.data.settings[idDD]?.prefijo || '';
    const prefas = Array.isArray(rawPrefijo) ? rawPrefijo : rawPrefijo ? [rawPrefijo] : ['#', '.', '/'];

    const rawBotname = global.db.data.settings[idDD]?.namebot2 || 'Diamond';
    const botname2 = /^[\w\s]+$/.test(rawBotname) ? rawBotname : 'San';

    const shortForms = [
      botname2.charAt(0),
      botname2.split(" ")[0],
      botname2.split(" ")[0].slice(0, 2),
      botname2.split(" ")[0].slice(0, 3)
    ];

    const prefixes = shortForms.map(name => `${name}`);
    prefixes.unshift(botname2);

    const prefixo = prefas.join('');
    globalThis.prefix = new RegExp(`^(${prefixes.join('|')})?[${prefixo}]`, 'i');

    const prefixMatch = body.match(globalThis.prefix);
    const prefix = prefixMatch ? prefixMatch[0] : null;
    if (!prefix) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    const text = args.join(' ');

    // -----------------------------
    // Datos generales
    // -----------------------------
    const pushname = m.pushName || 'Sin nombre';
    const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.lid;
    const chat = global.db.data.chats[m.chat] || {};

    // -----------------------------
    // Metadata de grupos
    // -----------------------------
    let groupMetadata = null;
    let groupAdmins = [];
    let groupName = '';

    if (m.isGroup) {
      groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
      groupName = groupMetadata?.subject || '';
      groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || [];
    }

    const isBotAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid ) : false;
    const isAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender ) : false;

    // -----------------------------
    // Validaciones de Primary / Owner
    // -----------------------------
    const fromprimary = global.db.data.chats[from];
    const consolePrimary = fromprimary.primaryBot;
    const selfId = client.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!consolePrimary || consolePrimary === selfId) {
      // solo log
    }

    const isVotOwn = [
      selfId,
      ...global.owner.map(num => num + '@s.whatsapp.net')
    ].includes(sender);

    if (global.db.data.settings[selfId]?.self) {
      const owner = global.db.data.settings[selfId]?.owner;
      if (sender !== owner && !isVotOwn && !global.mods.map(num => num + '@s.whatsapp.net').includes(sender)) return;
    }

    // -----------------------------
    // Comprobación comandos y ejecución
    // -----------------------------
    const cmdData = global.comandos.get(command);
    if (!cmdData) {
      await client.readMessages([m.key]);
      // comando no existe
    }

    try {
      await client.readMessages([m.key]);
      const user = global.db.data.chats[m.chat].users[m.sender] ||= {};
      const user2 = global.db.data.users[m.sender] ||= {};

      user2.usedcommands = (user2.usedcommands || 0) + 1;
      user.usedTime = new Date();
      user2.exp = (user2.exp || 0) + Math.floor(Math.random() * 100);
      user2.name = m.pushName;

      await cmdData?.run(client, m, args, command, text);
    } catch (error) {
      await client.sendMessage(m.chat, { text: `🌱 Error al ejecutar el comando\n${error}` }, { quoted: m });
    }

    // -----------------------------
    // Nivel
    // -----------------------------
    level(m);

  }); // <-- cierre client.on('message')
} // <-- cierre initHandler