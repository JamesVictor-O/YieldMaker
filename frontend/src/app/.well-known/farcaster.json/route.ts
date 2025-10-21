import { NextResponse } from 'next/server';

export async function GET() {
  const header = process.env.NEXT_PUBLIC_FARCASTER_HEADER;
  const payload = process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD;
  const signature = process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE;

  if (!header || !payload || !signature) {
    return NextResponse.json(
      { error: 'Farcaster account association env vars are missing' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      accountAssociation: {
        header,
        payload,
        signature,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    }
  );
}


