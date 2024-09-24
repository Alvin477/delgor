import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { passkey } = await req.json();

  // Validate the passkey
  if (passkey === process.env.KWAMEMULA_PASSKEY) {
    return NextResponse.json({ isValid: true }, { status: 200 });
  } else {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}
