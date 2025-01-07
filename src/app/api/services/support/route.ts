import { NextResponse } from 'next/server';
import { getSupportEmails } from '@api/services/support/support';

export async function GET() {
    try {
      const supportEmails = await getSupportEmails();
      return NextResponse.json(supportEmails);
    } catch (e) {
      return NextResponse.json(
        { error: 'Error fetching support emails', msg: e },
        { status: 500 }
      );
    }
  }
  