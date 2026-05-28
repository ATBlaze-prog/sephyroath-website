/**
 * Hall of Fame API Route
 * POST: Create new achievement (Admin/Owner only)
 * GET: Fetch all achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-utils';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const memberProfileId = searchParams.get('memberProfileId');

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (memberProfileId) {
      where.memberProfileId = memberProfileId;
    }

    const achievements = await prisma.hallOfFameAchievement.findMany({
      where,
      orderBy: {
        awardedDate: 'desc',
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

    return NextResponse.json({ success: true, data: achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const authResp = requireAdminOrOwner(session as any);
    if (authResp) return authResp;

    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    debugLog('POST /api/hall-of-fame by', (session as any)?.user?.role);
    const body = await request.json();
    const { memberProfileId, category, title, description, imageUrl } = body;

    if (!memberProfileId || !category || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const achievement = await prisma.hallOfFameAchievement.create({
      data: {
        memberProfileId,
        category,
        title,
        description,
        imageUrl,
        awardedBy: user.id,
        awardedDate: new Date(),
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

    return NextResponse.json({ success: true, data: achievement }, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}
