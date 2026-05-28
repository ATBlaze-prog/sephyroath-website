/**
 * Global Announcements API Route
 * GET: Fetch all active global announcements
 * POST: Create new global announcement (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { UserRole, NotificationSeverity } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    const announcements = await prisma.globalAnnouncement.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching global announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch global announcements' },
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
    debugLog('POST /api/global-announcements', (session as any)?.user?.role);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, severity, isActive, expiresAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, content)' },
        { status: 400 }
      );
    }

    const announcement = await prisma.globalAnnouncement.create({
      data: {
        title,
        content,
        severity: (severity || 'INFO') as NotificationSeverity,
        isActive: isActive !== false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE_GLOBAL_ANNOUNCEMENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        previousState: null,
        newState: announcement,
      },
    });

    return NextResponse.json({ success: true, data: announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating global announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create global announcement' },
      { status: 500 }
    );
  }
}
