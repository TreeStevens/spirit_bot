const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Define your server ID and channel ID here
const guildId = '561212490156081165';
const channelId = '562350069131509760';

client.once('ready', async () => {
  console.log('Bot is ready!');
  const guild = await client.guilds.fetch(guildId);

  if (!guild) {
    console.log(`Unable to find guild with ID ${guildId}.`);
    return;
  }

  const permissions = guild.me.permissions.serialize();
  const permissionString = Object.keys(permissions)
    .map((p) => `${p}: ${permissions[p]}`)
    .join('\n');

  console.log(`Bot permissions in server ${guild.name}:\n`);
  console.log(permissionString);

  // Write the permissions to log.txt file
  const logFilePath = path.join(__dirname, 'log.txt');
  fs.writeFileSync(logFilePath, permissionString);

  // Send a message to the specified channel
  const channel = guild.channels.cache.get(channelId);
  if (channel && channel.isText()) {
    channel.send(`The Spirit is with ${guild.name}! Stevens has given me the power to:\n\`\`\`${permissionString}\`\`\``);
  } else {
    console.log(`Unable to find channel with ID ${channelId} in server ${guild.name}.`);
  }
});

client.login('MTA4NzcwNzE4MjkwNjIxMjQ1Mg.GD8fb1.mlCpuzTSGvS-bH96vH2uJGoDQfDnvLJGQ7822U');
