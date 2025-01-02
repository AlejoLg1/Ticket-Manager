import { NextResponse } from 'next/server';
import { getCommentsByTicketId, createComment } from '@api/services/comment/comment';


export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const ticketId = Number(searchParams.get('ticketid'));
  
      if (!ticketId) {
        return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 });
      }
  
      const comments = await getCommentsByTicketId(ticketId);
      return NextResponse.json(comments, { status: 200 });
    } catch (e) {
      console.error("Error al obtener comentarios:", e);
      return NextResponse.json({ error: 'Error fetching comments', msg: e }, { status: 500 });
    }
  }


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createComment(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error creating comment', msg: e},
      { status: 500 }
    );
  }
}
