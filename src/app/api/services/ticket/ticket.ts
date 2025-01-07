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
      us.email as assigned_email,
      t.createdat,
      t.updatedat
    FROM tickets t
    INNER JOIN statuses s ON t.statusid = s.id
    INNER JOIN categories c ON t.categoryid = c.id
    LEFT JOIN users us ON t.assignedtoid = us.id
    INNER JOIN users u ON t.creatorid = u.id
    ORDER BY t.updatedat DESC;
  `);

  return res.rows.map(row => ({
    status: row.status_name,
    ticketNumber: row.ticket_id.toString(),
    contact: row.creator_email,
    category: row.category_name,
    message: row.message,
    subject: row.subject,
    role: 'support', // Pensar como hacerlo dinámico para reutilizar el endpoint -> Si es support aparece el botón de asignarme
    assignedUser: row.assignedtoid 
      ? { id: row.assignedtoid.toString(), email: row.assigned_email }
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
    status,
  } = data;

  if (!subject || !message || !category || !creatorId || !status) {
    throw new Error('Missing required fields');
  }

  const client = await pool.connect();
  try {
    console.log("STATUS: ", status)
    if (ticketNumber) {
      const query = `
        UPDATE tickets
        SET 
          subject = $1,
          message = $2,
          categoryid = (SELECT id FROM categories WHERE name = $3),
          statusid = (SELECT id FROM statuses WHERE name = $4),
          assignedtoid = $5,
          updatedat = NOW()
        WHERE id = $6
        RETURNING *;
      `;
      const values = [
        subject,
        message,
        category,
        status,
        assignedUser?.id || null,
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
          subject, message, categoryid, statusid, creatorid, createdat, updatedat
        )
        VALUES (
          $1, $2, (SELECT id FROM categories WHERE name = $3), (SELECT id FROM statuses WHERE name = $4), $5, NOW(), NOW()
        )
        RETURNING *;
      `;
      const values = [subject, message, category, status, creatorId];
      const res = await client.query(query, values);
      return res.rows[0];
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
