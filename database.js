// database.js - Database setup and helper functions
// SECTION ONE
import Database from 'better-sqlite3';
import chalk from 'chalk';

const db = new Database('spirit_bot.db');

//SECTION TWO - CREATE TABLES
// Create the users table if it doesn't exist
/*db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT,
    display_name TEXT,
    join_date TEXT,
    last_post_date TEXT
  )
`);

/// Create the points table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS points (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    display_name TEXT,
    lifetime_points INTEGER NOT NULL,
    current_points INTEGER NOT NULL,
    free_points INTEGER NOT NULL,
    hello_points INTEGER NOT NULL,
    war_points INTEGER NOT NULL,
    or_g_rounds_won INTEGER NOT NULL DEFAULT 0,
    or_g_total_points INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, server_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`);

// Create the transactions table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    points INTEGER NOT NULL,
    source TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (user_id, server_id) REFERENCES points(user_id, server_id)
  )
`);

// Create the or_g_game table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS or_g_game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game TEXT,
    round_number INTEGER,
    start_time INTEGER,
    end_time INTEGER,
    winner_id TEXT,
    status TEXT,
    ended_early INTEGER DEFAULT 0
  )
`);

// Create the participants table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    game TEXT,
    round_number INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY (game, round_number, user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`);
*/

// SECTION THREE - LOGGING

function logTableSchema(database, tableName) {
  const tableInfo = database.prepare(`PRAGMA table_info('${tableName}')`).all();
  console.log(chalk.red(`Schema for table '${tableName}':`));
  tableInfo.forEach(column => {
    console.log(`- ${column.name} (${column.type})`);
  });
}

console.log(chalk.green('*************************************************************'));
console.log(chalk.green(`* SPIRITBOT STARTED AT ${new Date().toLocaleTimeString()} ON ${new Date().toLocaleDateString()} *`));
console.log(chalk.green('*************************************************************'));

// SECTION 3.1: Fetch the current round number and end time from the database
function getCurrentRoundInfo() {
  const currentRound = db.prepare(`SELECT * FROM or_g_game WHERE status = 'active' ORDER BY round_number DESC LIMIT 1`).get();

  if (!currentRound) {
    return 'No active round found';
  }

  const endDate = new Date(currentRound.end_time * 1000);
  const endDateTimeString = `${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`;

  return `Current OR-G ROUND ${currentRound.round_number} Ending On: ${endDateTimeString}`;
}

console.log(chalk.yellow(getCurrentRoundInfo()));

// SECTION 3.2: Log the table schemas
logTableSchema(db, 'users');
logTableSchema(db, 'points');
logTableSchema(db, 'transactions');
logTableSchema(db, 'or_g_game');
logTableSchema(db, 'participants');

// SECTION FOUR - END

export default db;

