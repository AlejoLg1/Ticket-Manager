import pool from '@/lib/db';

interface SupportOption {
  id: string;
  text: string;
}

export const getSupportOptions = async (): Promise<SupportOption[]> => {
  const res = await pool.query(`
    SELECT 
      u.id AS id, 
      CONCAT(u.first_name, ' ', u.last_name) AS text
    FROM users u
    INNER JOIN supportwhitelist sw ON u.id = sw.user_id;
  `);

  return res.rows.map(row => ({
    id: row.id,
    text: row.text,
  }));
};
