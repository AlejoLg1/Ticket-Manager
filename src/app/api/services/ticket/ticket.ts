import pool from '@/lib/db';
import { Ticket, TicketPayload } from '@/models/ticket/ticket'

export const getTickets = async (): Promise<Ticket[]> => {
  const res = await pool.query(`
    SELECT 
      t.id AS ticket_id,
      t.subject,
      t.message,
      s.name AS status_name,
      c.name AS category_name,
      u.email AS creator_email,
      t.assignedtoid,
      t.assignedtoemail,
      t.createdat,
      t.updatedat
    FROM tickets t
    INNER JOIN statuses s ON t.statusid = s.id
    INNER JOIN categories c ON t.categoryid = c.id
    INNER JOIN users u ON t.creatorid = u.id
  `);

  return res.rows.map(row => ({
    status: row.status_name,
    ticketNumber: row.ticket_id.toString(),
    contact: row.creator_email,
    category: row.category_name,
    message: row.message,
    subject: row.subject,
    role: 'user', // Pensar como hacerlo dinámico para reutilizar el endpoint
    assignedUser: row.assignedtoid 
      ? { id: row.assignedtoid.toString(), email: row.assignedtoemail }
      : null,
  }));
};


export const createOrUpdateTicket = async (data: TicketPayload) => {
  const {
    ticketNumber,
    subject,
    message,
    category,
    assignedUser,
    creatorId,
  } = data;

  if (!subject || !message || !category || !creatorId) {
    throw new Error('Missing required fields');
  }
  const client = await pool.connect();
  try {
    if (ticketNumber) {
      const query = `
        UPDATE tickets
        SET 
          subject = $1,
          message = $2,
          categoryid = (SELECT id FROM categories WHERE name = $3),
          assignedtoid = $4,
          assignedtoemail = $5,
          updatedat = NOW()
        WHERE id = $6
        RETURNING *;
      `;
      const values = [
        subject,
        message,
        category,
        assignedUser?.id || null,
        assignedUser?.email || null,
        ticketNumber,
      ];

      const res = await client.query(query, values);
      if (res.rowCount === 0) {
        throw new Error('Ticket not found');
      }
      return res.rows[0];
    } else {
      const query = `
        INSERT INTO tickets (
          subject, message, categoryid, creatorid, createdat, updatedat
        )
        VALUES (
          $1, $2, (SELECT id FROM categories WHERE name = $3), $4, NOW(), NOW()
        )
        RETURNING *;
      `;
      const values = [subject, message, category, creatorId];
      const res = await client.query(query, values);
      return res.rows[0];
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
