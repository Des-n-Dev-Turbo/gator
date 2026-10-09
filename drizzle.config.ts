import { getDBUrl } from './src/lib/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: 'src/lib/schema.ts',
  out: 'src/lib/db',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDBUrl(),
  },
});
