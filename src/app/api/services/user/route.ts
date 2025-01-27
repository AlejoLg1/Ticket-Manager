import { NextResponse, NextRequest } from 'next/server';
import { createUser } from '@api/services/user/user';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'El campo email es obligatorio.' },
        { status: 400 }
      );
    }

    const user = await createUser(email);

    if (!user.success) {
      return NextResponse.json(user, { status: user.status || 500 });
    }

    return NextResponse.json({ success: true, user: user.data });
  } catch (error) {
    console.error('Error en el endpoint POST /api/services/user:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

