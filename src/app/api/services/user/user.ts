import pool from '@/lib/db';

export const getUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<{ id: string; email: string; role: string; name: string; lastName: string } | null> => {
  const res = await pool.query(
    `
    SELECT id, email, role, name, lastname
    FROM users
    WHERE email = $1 AND password = crypt($2, password)
    LIMIT 1;
    `,
    [email, password]
  );

  if (res.rows.length === 0) {
    return null;
  }

  const { id, email: userEmail, role, name, lastname } = res.rows[0];
  return { id: id.toString(), email: userEmail, role, name, lastName: lastname };
};