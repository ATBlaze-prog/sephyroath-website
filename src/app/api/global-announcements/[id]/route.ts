/**
 * Individual Global Announcement API Route
 * GET: Fetch single announcement
 * PUT: Update announcement (Admin/Owner only)
 * DELETE: Delete announcement (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { NotificationSeverity } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = await prisma.globalAnnouncement.findUnique({
      where: { id: params.id },
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcement' },
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
    debugLog('PUT /api/global-announcements/:id', (session as any)?.user?.role, params.id);

    const body = await request.json();
    const { title, content, severity, isActive, expiresAt } = body;

    // Get previous state for audit log
    const previousState = await prisma.globalAnnouncement.findUnique({
      where: { id: params.id },
    });

    const announcement = await prisma.globalAnnouncement.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        content: content || undefined,
        severity: severity || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_GLOBAL_ANNOUNCEMENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        previousState,
        newState: announcement,
      },
    });

    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update announcement' },
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
    debugLog('DELETE /api/global-announcements/:id', (session as any)?.user?.role, params.id);

    // Get data before deletion for audit log
    const announcement = await prisma.globalAnnouncement.findUnique({
      where: { id: params.id },
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      );
    }

    await prisma.globalAnnouncement.delete({
      where: { id: params.id },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE_GLOBAL_ANNOUNCEMENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        previousState: announcement,
        newState: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
