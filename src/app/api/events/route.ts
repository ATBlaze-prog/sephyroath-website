import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { startTime: 'desc' },
      ],
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to load events', error);
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
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

    const event = await prisma.event.update({
      where: { id },
      data: { isPinned },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Failed to toggle event pin', error);
    return NextResponse.json({ error: 'Failed to toggle event pin' }, { status: 500 });
  }
}
