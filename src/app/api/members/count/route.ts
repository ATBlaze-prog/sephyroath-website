import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.member.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to fetch member count', error);
    return NextResponse.json({ error: 'Failed to fetch member count' }, { status: 500 });
  }
}
