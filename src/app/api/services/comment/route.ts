

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
