import { NextResponse } from 'next/server';
import { getUserByEmailAndPassword } from '@api/services/user/user';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await getUserByEmailAndPassword(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error fetching user information.', msg: e },
      { status: 500 }
    );
  }
}
