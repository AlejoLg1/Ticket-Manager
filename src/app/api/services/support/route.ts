import { NextResponse } from 'next/server';
import { getSupportOptions } from '@api/services/support/support';

export async function GET() {
  try {
    const supportOptions = await getSupportOptions();
    return NextResponse.json(supportOptions);
  } catch (e) {
    return NextResponse.json(
      { error: 'Error fetching support options', msg: e },
      { status: 500 }
    );
  }
}
