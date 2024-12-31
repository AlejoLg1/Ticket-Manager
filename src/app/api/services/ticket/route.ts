import { NextResponse } from 'next/server';
import { getTickets } from '@api/services/ticket/ticket';

export async function GET() {
  try {
    const tickets = await getTickets();
    return NextResponse.json(tickets);
  } catch (e) {
    return NextResponse.json({ error: 'Error fetching tickets', msg: e }, { status: 500 });
  }
}
