import pool from '@/lib/db';

export async function createUser(email: string) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `
      INSERT INTO users (email, role)
      VALUES ($1, $2)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
      `,
      [email, 'user']
    );

    client.release();

    if (result.rows.length === 0) {
      return {
        success: true,
        message: 'El usuario ya existe.',
        status: 409,
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return {
      success: false,
      message: 'Error al crear el usuario.',
    };
  }
}