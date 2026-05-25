import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { startDate: 'desc' },
      ],
    });
    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Failed to load tournaments', error);
    return NextResponse.json({ error: 'Failed to load tournaments' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isPinned } = body;
    if (!id || typeof isPinned !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const tournament = await prisma.tournament.update({
      where: { id },
      data: { isPinned },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Failed to toggle tournament pin', error);
    return NextResponse.json({ error: 'Failed to toggle tournament pin' }, { status: 500 });
  }
}
