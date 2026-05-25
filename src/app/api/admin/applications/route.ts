import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: 'desc' },
    include: {
      game: true,
    },
  });

  return NextResponse.json(applications);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, updates, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing application id' }, { status: 400 });
    }

    if (action === 'approve') {
      const application = await prisma.application.findUnique({ where: { id } });
      if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      const member = await prisma.member.create({
        data: {
          ign: updates?.currentIgn ?? application.currentIgn,
          gender: updates?.gender ?? application.gender,
          joinedAt: new Date(),
          game: application.gameId ? { connect: { id: application.gameId } } : undefined,
        },
      });

      await prisma.application.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
          ...updates,
        },
      });

      return NextResponse.json({ success: true, member });
    }

    await prisma.application.update({
      where: { id },
      data: {
        ...updates,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to modify application', error);
    return NextResponse.json({ error: 'Failed to modify application' }, { status: 500 });
  }
}
