import { app } from './app.js';
import { assertEnvironment, env } from './config/env.js';
import { pool } from './db/pool.js';

try {
  assertEnvironment();
  await pool.query('SELECT 1');
  app.listen(env.port, () => console.log(`API listening on port ${env.port}`));
} catch (error) {
  console.error(`Unable to start API: ${error.message}`);
  process.exit(1);
}
