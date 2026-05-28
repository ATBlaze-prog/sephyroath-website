/**
 * Individual Announcement API Route
 * GET: Fetch single announcement
 * PUT: Update announcement (Admin/Owner only)
 * DELETE: Delete announcement (Admin/Owner only)
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
    const announcement = await prisma.announcement.findUnique({
      where: { id: params.id },
      include: {
        authorUser: {
          select: {
            id: true,
            email: true,
            realName: true,
          },
        },
      },
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
    debugLog('PUT /api/announcements/:id', (session as any)?.user?.role, params.id);

    const body = await request.json();
    const { title, content, featuredImage, isPublished } = body;

    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        content: content || undefined,
        featuredImage: featuredImage || undefined,
        isPublished: isPublished || undefined,
        publishedAt: isPublished ? new Date() : undefined,
      },
      include: {
        authorUser: {
          select: {
            id: true,
            email: true,
            realName: true,
          },
        },
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
    debugLog('DELETE /api/announcements/:id', (session as any)?.user?.role, params.id);

    await prisma.announcement.delete({
      where: { id: params.id },
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
