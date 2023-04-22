const Database = require('better-sqlite3');
const db = new Database('spirit_bot.db');

function logTableSchema(db, tableName) {
  const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
  console.log(`Schema for table '${tableName}':`);
  schema.forEach(column => {
    console.log(`- ${column.name} (${column.type})`);
  });
}

logTableSchema(db, 'users');
logTableSchema(db, 'points');
logTableSchema(db, 'transactions');
