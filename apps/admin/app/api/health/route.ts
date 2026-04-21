import { NextResponse } from 'next/server';

export function GET(): NextResponse {
  return NextResponse.json({
    status: 'ok',
    surface: 'admin',
    timestamp: new Date().toISOString()
  });
}
