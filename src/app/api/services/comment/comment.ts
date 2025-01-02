import pool from '@/lib/db';
import { CommentPayload } from '@/models/comment/comment';


export const getCommentsByTicketId = async (ticketId: number) => {
    
  if (!ticketId) {
    throw new Error('Missing ticketId');
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT id, comment FROM comments WHERE ticketid = $1;
    `;
    const values = [ticketId];
    const result = await client.query(query, values);

    return result.rows.map((row: { id: number; comment: string }) => ({
      id: row.id.toString(),
      comment: row.comment,
    }));
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  } finally {
    client.release();
  }
};


export const createComment = async (data: CommentPayload) => {
    console.log("ESTOY ACÁ")
  const { ticketId, supportId, message } = data;

  if (!ticketId || !supportId || !message) {
    throw new Error('Missing required fields');
  }

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO comments (
        ticketid, supportid, comment, createdat, updatedat
      )
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *;
    `;
    const values = [ticketId, supportId, message];
    const res = await client.query(query, values);
    
    return res.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
