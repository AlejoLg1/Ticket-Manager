

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
