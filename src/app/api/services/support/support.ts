import pool from '@/lib/db';

export const getSupportEmails = async (): Promise<string[]> => {
    const res = await pool.query(`
      SELECT email
      FROM supportwhitelist
      ORDER BY email ASC;
    `);
  
    return res.rows.map(row => row.email);
  };
  