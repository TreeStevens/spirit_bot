// fix_users_points.js
// Require the database and Discord.js
const db = require('./database');
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

// Initialize the Discord client with the necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Log a message to the console when the client is ready
client.once('ready', async () => {
  console.log('Running fix_users_points.js script...');

  // Fetch all users from the users table
  const users = db.prepare('SELECT * FROM users').all();

  // Loop through each user and check if they have an entry in the points table
  users.forEach(async (user) => {
    const guild = client.guilds.cache.first();
    const guildMember = await guild.members.fetch(user.user_id);

    const pointsEntry = db.prepare('SELECT * FROM points WHERE user_id = ?').get(user.user_id);

    // If the user doesn't have an entry in the points table, create one with 100 lifetime points
    if (!pointsEntry) {
      db.prepare(
        'INSERT INTO points (user_id, lifetime_points) VALUES (?, ?)'
      ).run(user.user_id, 100);
    }

    if (!pointsEntry) {
      db.prepare(
        'INSERT INTO points (user_id, lifetime_points, current_points) VALUES (?, ?, ?)'
      ).run(user.user_id, 100, 100);
    }   

    // If the display_name in the database doesn't match the current display name, update it
    if (user.display_name !== guildMember.displayName) {
      db.prepare(
        'UPDATE users SET display_name = ? WHERE user_id = ?'
      ).run(guildMember.displayName, user.user_id);
    }
  });

  console.log('Users have been updated with initial points and correct display names.');
});

// Log in to the Discord client
client.login(config.token);
