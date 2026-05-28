/**
 * Tournaments API Route
 * POST: Create new tournament (Admin/Owner only)
 * GET: Fetch all tournaments
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
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      orderBy: {
        startDate: 'asc',
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

    return NextResponse.json({ success: true, data: tournaments });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tournaments' },
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

    debugLog('POST /api/tournaments body', (session as any)?.user?.role);
    const body = await request.json();
    const { title, description, status, startDate, bannerUrl, prizePool, maxTeams, rules } = body;

    if (!title || !startDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields (title, startDate)' }, { status: 400 });
    }

    const tournament = await prisma.tournament.create({
      data: {
        title,
        description,
        status: status || 'UPCOMING',
        startDate: new Date(startDate),
        bannerUrl,
        prizePool,
        maxTeams: maxTeams ? Number(maxTeams) : undefined,
        rules,
        createdBy: user?.id,
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

    return NextResponse.json({ success: true, data: tournament }, { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}
