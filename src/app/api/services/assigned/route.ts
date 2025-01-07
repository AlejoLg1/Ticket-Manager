import { NextResponse } from 'next/server';
import { updateAssignedTo } from '@api/services/assigned/assigned';  

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const ticketNumber = url.searchParams.get('ticketNumber'); 
    const { assignedtoid } = await req.json();
    
    if (!ticketNumber) {
      return NextResponse.json({ error: 'Ticket number is required' }, { status: 400 });
    }

    await updateAssignedTo(ticketNumber, assignedtoid);

    return NextResponse.json({ message: 'AssignedToId updated successfully' });
  } catch (e) {
    console.error('Error updating assignedtoid:', e);
    return NextResponse.json({ error: 'Error updating assignedtoid', msg: e }, { status: 500 });
  }
}
