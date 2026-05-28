/**
 * Individual Hall of Fame Achievement API Route
 * GET: Fetch single achievement
 * PUT: Update achievement (Admin/Owner only)
 * DELETE: Delete achievement (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievement = await prisma.hallOfFameAchievement.findUnique({
      where: { id: params.id },
      include: {
        memberProfile: {
          select: {
            id: true,
            inGameName: true,
            avatarUrl: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        awardedByUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: 'Achievement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: achievement });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievement' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    const authResp = requireAdminOrOwner(session as any);
    if (authResp) return authResp;

    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    debugLog('PUT /api/hall-of-fame/[id]', (session as any)?.user?.role, params.id);

    const body = await request.json();
    const { category, title, description, imageUrl } = body;

    const achievement = await prisma.hallOfFameAchievement.update({
      where: { id: params.id },
      data: {
        category: category || undefined,
        title: title || undefined,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
      },
      include: {
        memberProfile: {
          select: {
            id: true,
            inGameName: true,
            avatarUrl: true,
          },
        },
        awardedByUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: achievement });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    const authResp = requireAdminOrOwner(session as any);
    if (authResp) return authResp;

    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    debugLog('DELETE /api/hall-of-fame/[id]', (session as any)?.user?.role, params.id);

    await prisma.hallOfFameAchievement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}
