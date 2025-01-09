'use server'

import pool from '@/lib/db';
import { NextApiRequest } from 'next';
import { Ticket, TicketPayload } from '@/models/ticket/ticket'
import { getToken } from 'next-auth/jwt';

export const getTickets = async (req: NextApiRequest): Promise<Ticket[]> => {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = String(token?.role || "user")
  console.log("🚀 ~ getTickets ~ token:", token);

  if (!token) {
    throw new Error('No token found');
  }
  
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
    role: role,
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
          updatedat = NOW()
        WHERE id = $5
        RETURNING *;
      `;
      const values = [
        subject,
        message,
        category,
        status,
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
