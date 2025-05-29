import { getVariableByEnv } from '@/utils/commonFunctions';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: getVariableByEnv('DATABASE_URL'),
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
