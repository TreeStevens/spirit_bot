// Spirit Bot - spiritbot.js - main file for Spirit Bot

// SECTION ZERO: Things we know and assumptions
// 1. We are using ES modules due to the "type": "module" in package.json.
// 2. Flags (GatewayIntentBits) have been causing issues, so we avoid using them.
// 3. Since we are using ES modules, we can't use require directly. Instead, we use import statements.
// 4. We have been making changes to the code to be compatible with ES modules.

// SECTION ONE: Import the required packages
import discord from 'discord.js';
const { Client, Intents, Collection, MessageEmbed } = discord;
import sqlite3 from 'sqlite3';
import fs from 'fs';
import cron from 'node-cron';
import config from './config.json' assert { type: 'json' };

// SECTION TWO: Initialize the Discord client with the necessary intents
const client = new Client({
  intents: [
    1 << 0, // Guilds
    1 << 10, // GuildMessages
    1 << 12, // MessageContent
  ],
});

// SECTION THREE: Initialize the SQLite database
const db = new sqlite3.Database('pts.db');

// SECTION FOUR: Log a message to the console when the client is ready
client.once('ready', () => {
  console.log('Catch the Spirit!!');

  // Schedule a task to run Wellness Check at 11:37 AM every day
  cron.schedule('0 6 * * *', () => {
    // Replace CHANNEL_ID with the actual channel ID you want to send the message to
    const channelId = '998940746918936677';
    sendMessageToChannel(client, channelId);
  }, {
    timezone: 'America/New_York'
  });
});

// SECTION FIVE: Send wellness check message
async function sendMessageToChannel(client, channelId) {
  const channel = await client.channels.fetch(channelId);

  const embed = new MessageEmbed() // Update to use MessageEmbed
    .setAuthor({
      name: "Spirit Bot",
      url: "https://example.com",
    })
    .setTitle("Daily Wellness Check")
    .setDescription("Share how you're feeling by reacting below.\n\nYour fellow Cultists care.\n\n💙 I'm doing great\n💚 I'm okay\n💛 I'm meh\n💜 Things are tough, I'm struggling \n💔 I'm having a hard time and need  someone to talk to")
    .setThumbnail("https://cdn.discordapp.com/attachments/824235590870237214/1097160026893848728/sq-well.png")
    .setColor("#d17015")
    .setTimestamp();

  channel.send({ embeds: [embed] });
}

// SECTION SIX: Command handler
client.commands = new Collection();

async function loadCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const commandModule = await import(`./commands/${file}`);
    console.log(`Loaded module: ${file}`);
    const command = commandModule.command;
    client.commands.set(command.data.name.toLowerCase(), command);
  }
}

loadCommands(); // Call the function to load the commands

// SECTION 6.5: Interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});


// SECTION 6.5: Interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});


// SECTION SEVEN: Login to Discord
client.login(config.token);

// SECTION EIGHT: Listen for messages in channel - give 10 points for posting in OR-G channel - give 100 free points for joining the Cult via this channel
client.on('messageCreate', async message => {
  if (message.channel.id === '995017470287028264') {
    const user = message.author;
    const userId = user.id;
    const displayName = user.username;

    const sqlSelect = `
      SELECT user_id FROM users WHERE user_id = ?
    `;

    const sqlInsert = `
      INSERT INTO users (user_id, username, display_name, join_date, last_post_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    const sqlUpdate = `
      UPDATE users SET last_post_date = ? WHERE user_id = ?
    `;

    const now = new Date();
    const joinDate = now;

    const existingUser = db.prepare(sqlSelect).get(userId);

    if (!existingUser) {
      db.prepare(sqlInsert).run(userId, user.username, displayName, joinDate, now);
      updatePoints(userId, 100);
    } else {
      db.prepare(sqlUpdate).run(now, userId);
      updatePoints(userId, 10); // Give an additional 10 points for posting in the OR-G channel
    }
  }
});



    // The listener will only run if the message is in the channel with ID 995017470287028264

