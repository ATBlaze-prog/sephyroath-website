import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';

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
  const authResp = requireAdminOrOwner(session as any);
  if (authResp) return authResp;

  try {
    const body = await request.json();
    debugLog('POST /api/members', body, 'by', (session as any)?.user?.role);
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
  const authResp = requireAdminOrOwner(session as any);
  if (authResp) return authResp;

  try {
    const user = await prisma.user.findUnique({ where: { email: (session.user as any).email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();

    // Fetch member before deletion for audit log
    const member = await prisma.member.findUnique({ where: { id: body.id } });
    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    const deleted = await prisma.member.delete({ where: { id: body.id } });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE_MEMBER',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        previousState: member,
        newState: null,
      },
    });

    debugLog('DELETE /api/members', user.id, body.id);

    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting member', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
