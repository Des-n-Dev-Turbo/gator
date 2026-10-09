import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../schema.js';
import { readConfig } from '../config.js';

const config = readConfig();
const configObj = JSON.parse(config);
const conn = postgres(configObj.dbUrl);
export const db = drizzle(conn, { schema });
