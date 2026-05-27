import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    // Return both Member and MemberProfile for flexibility
    const memberProfiles = await prisma.memberProfile.findMany({
      select: {
        id: true,
        inGameName: true,
        avatarUrl: true,
        clanRank: true,
        joinDate: true,
      },
      orderBy: {
        inGameName: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: memberProfiles });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const member = await prisma.member.create({
      data: {
        ign: body.ign,
        gender: body.gender,
        joinedAt: body.joinedAt ? new Date(body.joinedAt) : new Date(),
        game: body.gameId ? { connect: { id: body.gameId } } : undefined,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating member', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const deleted = await prisma.member.delete({
      where: { id: body.id },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting member', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
