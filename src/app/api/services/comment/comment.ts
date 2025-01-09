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


export const deleteCommentById = async (commentId: number) => {
    if (!commentId) {
      throw new Error('Missing commentId');
    }
  
    const client = await pool.connect();
    try {
      const query = `
        DELETE FROM comments WHERE id = $1;
      `;
      const values = [commentId];
      await client.query(query, values);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  