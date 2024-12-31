import pool from '@/lib/db';
import { Ticket } from '@/models/ticket/ticket'

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
