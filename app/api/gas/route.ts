import { NextRequest, NextResponse } from 'next/server';

function buildGASUrl(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const params = new URLSearchParams();

  // forward ALL query params (path, token, idpel, etc)
  searchParams.forEach((value, key) => {
    params.append(key, value);
  });

  return `${process.env.GAS_BASE_URL}?${params.toString()}`;
}

export async function GET(req: NextRequest) {
  const url = buildGASUrl(req);

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const url = buildGASUrl(req);
  const body = await req.json();

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
