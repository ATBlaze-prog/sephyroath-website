/**
 * Individual Tournament API Route
 * GET: Fetch single tournament
 * PUT: Update tournament (Admin/Owner only)
 * DELETE: Delete tournament (Admin/Owner only)
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
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        brackets: true,
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tournament });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tournament' },
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
    const {
      title,
      description,
      gameId,
      status,
      startDate,
      endDate,
      bannerUrl,
      prizePool,
      maxTeams,
      registrationDeadline,
      registrationLink,
      schedule,
      rules,
    } = body;

    const tournament = await prisma.tournament.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        description: description || undefined,
        gameId: gameId || undefined,
        status: status || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        bannerUrl: bannerUrl || undefined,
        prizePool: prizePool || undefined,
        maxTeams: maxTeams || undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        registrationLink: registrationLink || undefined,
        schedule: schedule || undefined,
        rules: rules || undefined,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: tournament });
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tournament' },
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

    await prisma.tournament.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tournament' },
      { status: 500 }
    );
  }
}
