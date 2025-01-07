import pool from '@/lib/db';

export const updateAssignedTo = async (ticketNumber: string, assignedToId: number | null): Promise<void> => {
    try {
      const result = await pool.query(
        `UPDATE tickets
         SET assignedtoid = $1, updatedat = current_timestamp
         WHERE id = $2`,
        [assignedToId, ticketNumber]
      );
  
      if (result.rowCount === 0) {
        throw new Error('Ticket no encontrado');
      }
    } catch (error) {
      console.error('Error actualizando assignedtoid:', error);
      throw error;
    }
  };
  