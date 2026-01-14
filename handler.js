import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import level from './commands/level.js';
import antilink from './commands/antilink.js';
import { getGroupAdmins } from './lib/message.js';

seeCommands();

export default async (client, m) => {
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

  if (
    m.id.startsWith('3EB0') ||
    (m.id.startsWith('BAE5') && m.id.length === 16) ||
    (m.id.startsWith('B24E') && m.id.length === 20)
  )
    return;

  initDB(m, client);
  antilink(m, client);

  const from = m.key.remoteJid;
  const idDD = client.user.id.split(':')[0] + '@s.whatsapp.net' || '';
  const rawPrefijo = global.db.data.settings[idDD].prefijo || '';
  const prefas = Array.isArray(rawPrefijo)
    ? rawPrefijo
    : rawPrefijo
    ? [rawPrefijo]
    : ['#', '/'] || ['#', '/'];

  const rawBotname = global.db.data.settings[idDD].namebot2 || 'LMZ';
  const tipo = global.db.data.settings[idDD].type || 'Sub';

  const isValidBotname = /^[\w\s]+$/.test(rawBotname);
  const botname2 = isValidBotname ? rawBotname : 'San';

  const shortForms = [
    botname2.charAt(0),
    botname2.split(' ')[0],
    tipo.split(' ')[0],
    botname2.split(' ')[0].slice(0, 2),
    botname2.split(' ')[0].slice(0, 3),
  ];

  const prefixes = shortForms.map((name) => `${name}`);
  prefixes.unshift(botname2);

  const prefixo = prefas.join('');

  globalThis.prefix = new RegExp(`^(${prefixes.join('|')})?[${prefixo}]`, 'i');

  const prefixMatch = body.match(globalThis.prefix);
  const prefix = prefixMatch ? prefixMatch[0] : null;

  const tf = global.db.data.chats[from].users[m.sender] || {};
  const to = new Date()
    .toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');
  if (!tf.stats) tf.stats = {};
  if (!tf.stats[to]) tf.stats[to] = { msgs: 0, cmds: 0 };
  tf.stats[to].msgs++;

  if (!prefix) return;

  const args = body.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();
  const text = args.join(' ');

  const pushname = m.pushName || 'Sin nombre';
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.lid;
  const chat = global.db.data.chats[m.chat] || {};

  let groupMetadata = null;
  let groupAdmins = [];
  let groupName = '';

  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
    groupName = groupMetadata?.subject || '';
    groupAdmins =
      groupMetadata?.participants.filter(
        (p) => p.admin === 'admin' || p.admin === 'superadmin'
      ) || [];
  }

  // Solo se verifica admin/botAdmin en grupos
  const isBotAdmins = m.isGroup
    ? groupAdmins.some(
        (p) =>
          p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid
      )
    : true;

  const isAdmins = m.isGroup
    ? groupAdmins.some(
        (p) =>
          p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender
      )
    : true;

  const fromprimary = global.db.data.chats[from];
  const consolePrimary = fromprimary.primaryBot;

  if (!consolePrimary || consolePrimary === client.user.id.split(':')[0] + '@s.whatsapp.net') {
    console.log(
      `𝄢 · • —– ٠ ✤ ٠ —– • · · • —– ٠ ✤ ٠ —– • ·✧༄
❚ ▸ ${chalk.cyan('𝐁𝐎𝐓 ❱❱')} ${chalk.bgMagenta(chalk.white.italic(client.user.id))}
❚ ▸ ${chalk.cyan('𝐇𝐎𝐑𝐀𝐑𝐈𝐎 ❱❱')} ${chalk.black.bgWhite(moment().format('DD/MM/YY HH:mm:ss'))}
❚ ▸ ${chalk.magentaBright('°o.OO.o°°o.OO.o°°o.OO.o°')}
❚ ▸ ${chalk.green('𝐔𝐒𝐔𝐀𝐑𝐈𝐎 ❱❱')} ${chalk.white(pushname)}
❚ ▸ ${chalk.green('𝐆𝐑𝐔𝐏𝐎 ❱❱')} ${
        m.isGroup ? chalk.cyan(groupName) : chalk.cyan(from)
      }
❚ ▸ ${chalk.green('𝐈𝐃 ❱❱')} ${chalk.cyan(from)}
𝄢 · • —– ٠ ✤ ٠ —– • · · • —– ٠ ✤ ٠ —– • ·✧༄`
    );
  }

  const cmdData = global.comandos.get(command);

  if (!cmdData) {
    await client.readMessages([m.key]);
    return m.reply(
      `ꕤ El comando *${command}* no existe.\n✎ Usa *${prefix}help* para ver la lista de comandos disponibles.`
    );
  }

  // Propietario y permisos
  const isOwner =
    global.owner.map((num) => num + '@s.whatsapp.net').includes(sender) ||
    sender === global.db.data.settings[botJid]?.owner;

  if (cmdData.isOwner && !isOwner)
    return m.reply(
      `ꕤ El comando *${command}* no existe.\n✎ Usa *${prefix}help* para ver la lista de comandos disponibles.`
    );
  if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat, 'Solo administradores', m);
  if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat, 'Necesito ser admin', m);

  try {
    await client.readMessages([m.key]);
    const user2 = global.db.data.users[m.sender] || {};
    const bot = global.db.data.settings[botJid] || {};

    user2.usedcommands = (user2.usedcommands || 0) + 1;
    bot.commandsejecut = (bot.commandsejecut || 0) + 1;
    user.usedTime = new Date();
    user2.exp = (user2.exp || 0) + Math.floor(Math.random() * 100);
    user2.name = m.pushName;

    const today = new Date()
      .toLocaleDateString('es-CO', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/')
      .reverse()
      .join('-');

    const user = global.db.data.chats[m.chat].users[m.sender] || {};
    if (!user.stats) user.stats = {};
    if (!user.stats[today]) user.stats[today] = { msgs: 0, cmds: 0 };
    user.stats[today].cmds++;

    await cmdData.run(client, m, args, command, text, prefix);
  } catch (error) {
    return m.reply('🌱 Error al ejecutar el comando.');
  }

  level(m);
};
