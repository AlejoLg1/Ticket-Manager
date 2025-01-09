import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { getTickets, createOrUpdateTicket } from '@api/services/ticket/ticket';

export async function GET(req: NextApiRequest) {
  try {
    const tickets = await getTickets(req);
    return NextResponse.json(tickets);
  } catch (e) {
    return NextResponse.json({ error: 'Error fetching tickets', msg: e }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createOrUpdateTicket(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Error handling ticket', msg: e }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const ticketNumber = url.searchParams.get('ticketNumber');
    
    if (!ticketNumber) {
      return NextResponse.json({ error: 'Ticket number is required' }, { status: 400 });
    }

    const body = await req.json();
    const result = await createOrUpdateTicket({ ...body, ticketNumber });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Error updating ticket', msg: e }, { status: 500 });
  }
}