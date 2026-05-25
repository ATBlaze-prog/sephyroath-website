import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.role || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'OWNER'] } },
    select: {
      id: true,
      email: true,
      realName: true,
      age: true,
      joinedAt: true,
      role: true,
      accountStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(admins);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || session.user.role !== 'OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !['approve', 'suspend', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (action === 'delete') {
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ success: true });
    }

    const status = action === 'approve' ? 'ACTIVE' : 'SUSPENDED';
    await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update admin user', error);
    return NextResponse.json({ error: 'Failed to update admin user' }, { status: 500 });
  }
}
