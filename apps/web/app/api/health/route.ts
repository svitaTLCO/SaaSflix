import { NextResponse } from 'next/server';

export function GET(): NextResponse {
  return NextResponse.json({
    status: 'ok',
    surface: 'web',
    timestamp: new Date().toISOString()
  });
}
