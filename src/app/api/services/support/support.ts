import pool from '@/lib/db';

export const getSupportEmails = async (): Promise<string[]> => {
    const res = await pool.query(`
      SELECT u.email
        FROM users u
        INNER JOIN supportwhitelist sw ON u.id = sw.user_id;
    `);
  
    return res.rows.map(row => row.email);
  };
  