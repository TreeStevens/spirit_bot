const db = require('./database.js');

const startTime = new Date('2023-04-21T00:00:00Z');
const endTime = new Date('2023-04-23T00:00:00Z');

db.exec(`
  INSERT INTO or_g_game (game, round_number, start_time, end_time, status) VALUES
  ('OR-G', 1, ${startTime.getTime()}, ${endTime.getTime()}, 'active')
`);
