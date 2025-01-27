import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getTickets, createOrUpdateTicket } from '@api/services/ticket/ticket';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = {
      userId: searchParams.get('userId') || undefined,
      status: searchParams.get('status') || undefined,
      ticketNumber: searchParams.get('ticketNumber') || undefined,
      assignedUser: searchParams.get('assignedUser') || undefined,
      category: searchParams.get('category') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10'),
    };

    const { tickets, totalItems } = await getTickets(req, filters);
    return NextResponse.json({ tickets, totalItems });
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