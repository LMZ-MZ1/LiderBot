import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment-timezone';

export default {
  command: ['allmenu', 'help', 'menu'],
  category: 'info',
  run: async (client, m, args) => {
    try {
      const now = new Date();
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const tiempo = colombianTime.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/,/g, '');
      const tiempo2 = moment.tz('America/Bogota').format('hh:mm A');

      const botId = client?.user?.id.split(':')[0] + '@s.whatsapp.net' || '';
      const botSettings = global.db.data.settings[botId] || {};
      const botname = botSettings.namebot || '';
      const botname2 = botSettings.namebot2 || '';
      const banner = botSettings.banner || '';
      const owner = botSettings.owner || '';
      const canalId = botSettings.id || '';
      const canalName = botSettings.nameid || 'LegnaMetalZoa';
      const link = botSettings.link || bot.api;

      const prefix = botSettings.prefijo

      const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net';
      const isPremiumBot = botSettings.botprem === true;
      const isModBot = botSettings.botmod === true;
      const botType = isOficialBot
        ? 'Bot al servicio del lídel del clan ᴷᴵᴺᴳMÉXICOᴷᴵᴺᴳ'
        : isPremiumBot
          ? 'Premium'
          : isModBot
            ? 'Principal/Mod'
            : 'Sub Bot';
      const users = Object.keys(global.db.data.users).length;
      const device = getDevice(m.key.id);
      const sender = global.db.data.users[m.sender].name;

const time = client.uptime ? formatearMs(Date.now() - client.uptime) : "Desconocido"

      let menu = `> *¡ʜᴏʟᴀ!* $username, como está tu día?, mucho gusto mi nombre es *$namebot*

*┏━ $namebot ━⊜*
┃⋄ 📅 *Fecha* :: $fecha, $fecha2
┃⋄ </> *Developer* :: $owner
┃⋄ 🌾 *Tipo* :: $botType
┃⋄ 🍃 *Sistema* :: $device
┃⋄ 🦋 *Enlace* :: $link
┗━━◘

乂 *ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs* 乂

 .  . ︵ *DESCARGAS*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /facebook › /fb + _<url>_
.꒷🌳.𖦹˙ /mediafire › /mf + _<query|url>_
.꒷🌳.𖦹˙ /gdrive › /drive + _<url>_
.꒷🌳.𖦹˙ /instagram › /ig + _<url>_
.꒷🌳.𖦹˙ /tiktok › /tt + _<url|query>_
.꒷🌳.𖦹˙ /play › /mp3 › /playaudio › /ytaudio › /ytmp3 + _<url|query>_
.꒷🌳.𖦹˙ /play2 › /mp4 › /playvideo › /ytvideo › /ytmp4 + _<url|query>_

 .  . ︵ *ɢʀᴜᴘᴏ*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /bot + _<on|off>_
.꒷🌳.𖦹˙ /promote + _<mention>_
.꒷🌳.𖦹˙ /demote + _<mention>_
.꒷🌳.𖦹˙ /setprimary + _<mention>_
.꒷🌳.𖦹˙ /warn + _<mention>_ + _<razón>_
.꒷🌳.𖦹˙ /warns + _<mention>_
.꒷🌳.𖦹˙ /delwarn + _<mention> <número|all>_
.꒷🌳.𖦹˙ /setwarnlimit + _<número>_
.꒷🌳.𖦹˙ /clear + _<delete|views>_
.꒷🌳.𖦹˙ /setgpbaner 
.꒷🌳.𖦹˙ /setgpname + _<text>_
.꒷🌳.𖦹˙ /setgpdesc + _<text>_
.꒷🌳.𖦹˙ /closet › /open 
.꒷🌳.𖦹˙ /welcome › /bienvenidas › /alerts › /alertas › /gacha › /rpg › /economy › /economia › /adminonly › /onlyadmin › /antilinks › /antilink › /antienlaces + _<on|off>_
.꒷🌳.𖦹˙ /groupinfo › /gp 
.꒷🌳.𖦹˙ /tag › /hidetag + _<text>_

 .  . ︵ *ɪᴀ*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /ia › /chatgpt + _<query>_

 .  . ︵ *ɪɴғᴏ*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /allmenu › /menu › /help + _<category>_
.꒷🌳.𖦹˙ /ayuda + _<comando>_
.꒷🌳.𖦹˙ /creador › /owner 
.꒷🌳.𖦹˙ /invitar › /invite + _<link>_

 .  . ︵ *ᴘʀᴏғɪʟᴇ*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /level › /levelup › /lvl + _<mention>_
.꒷🌳.𖦹˙ /marry + _<mention>_
.꒷🌳.𖦹˙ /divorce 
.꒷🌳.𖦹˙ /profile › /perfil 
.꒷🌳.𖦹˙ /setbirth + _<dia/mes/año|mes/dia>_
.꒷🌳.𖦹˙ /setpasatiempo › /sethobby 
.꒷🌳.𖦹˙ /delbirth 
.꒷🌳.𖦹˙ /delpasatiempo › /removehobby 
.꒷🌳.𖦹˙ /setdescription › /setdesc + _<text>_
.꒷🌳.𖦹˙ /deldescription › /deldesc 
.꒷🌳.𖦹˙ /setgenre + _<hombre|mujer>_
.꒷🌳.𖦹˙ /delgenre 

 .  . ︵ *sᴇᴀʀᴄʜ*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /pinterest › /pin + _<query>_
.꒷🌳.𖦹˙ /imagen › /img + _<query>_
.꒷🌳.𖦹˙ /aptoide › /apk › /apkdl + _<query>_
.꒷🌳.𖦹˙ /ytsearch › /search + _<query>_
.꒷🌳.𖦹˙ /ttsearch › /tiktoksearch › /tts + _<query>_


 .  . ︵ *ᴜᴛɪʟs*.  ◌Ⳋ𝅄
.꒷🌳.𖦹˙ /sticker › /s  
.꒷🌳.𖦹˙ /getpic › /pfp + _<mention>_ 
.꒷🌳.𖦹˙ /translate + _<idioma>_ + _<text>_
.꒷🌳.𖦹˙ /get + _<url>_
.꒷🌳.𖦹˙ /setmeta + _<packname> | <author>_
.꒷🌳.𖦹˙ /hd 

> *$namebot desarrollado por LegnaMetalZoa*`.trim();

      const replacements = {
        $owner: owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? `@${owner.split('@')[0]}` : owner) : 'Oculto por privacidad',
        $botType: botType,
        $device: device,
        $tiempo: tiempo,
        $tiempo2: tiempo2,
        $users: users.toLocaleString() || '0',
        $link: link,
        $sender: sender,
        $botname2: botname2,
        $botname: botname2,
        $namebot: botname2,
        $prefix: prefix,
        $uptime: time
      };

      for (const [key, value] of Object.entries(replacements)) {
        menu = menu.replace(new RegExp(`\\${key}`, 'g'), value);
      }

      if (banner.endsWith('.mp4') || banner.endsWith('.gif') || banner.endsWith('.webm')) {
        await client.sendMessage(
          m.chat,
          {
            video: { url: banner },
            gifPlayback: true,
            caption: menu,
            contextInfo: {
              mentionedJid: [owner, m.sender],
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: canalId,
                serverMessageId: '0',
                newsletterName: canalName
              }
            }
          },
          { quoted: m }
        );
      } else {
        await client.sendMessage(
          m.chat,
          {
            text: menu,
            contextInfo: {
              mentionedJid: [owner, m.sender],
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: canalId,
                serverMessageId: '0',
                newsletterName: canalName
              },
              externalAdReply: {
                title: botname,
                body: `${botname2}, LegnaMetalZoa`,
                showAdAttribution: false,
                thumbnailUrl: banner,
                mediaType: 1,
                previewType: 0,
                renderLargerThumbnail: true
              }
            }
          },
          { quoted: m }
        );
      }
    } catch (e) {
      await m.reply(msgglobal);
    }
  }
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`].filter(Boolean).join(" ");
}
