/**
 * Individual Hall of Fame Achievement API Route
 * GET: Fetch single achievement
 * PUT: Update achievement (Admin/Owner only)
 * DELETE: Delete achievement (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-utils';
import { UserRole } from '@prisma/client';

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !isAdmin(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !isAdmin(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

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
