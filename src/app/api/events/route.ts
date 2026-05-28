/**
 * Events API Route
 * POST: Create new event (Admin/Owner only)
 * GET: Fetch all published events
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
    const status = searchParams.get('status') || 'PUBLISHED';

    const events = await prisma.event.findMany({
      where: {
        status: status as any,
      },
      orderBy: {
        startTime: 'asc',
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

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
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

    debugLog('POST /api/events body (raw)');
    const body = await request.json();
    debugLog('session.role', (session as any)?.user?.role, 'body:', body);
    const { title, description, eventType, startTime, endTime, location, bannerUrl, status } = body;

    if (!title || !eventType || !startTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventType,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : undefined,
        location,
        bannerUrl,
        status: status || 'DRAFT',
        createdBy: user.id,
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

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
