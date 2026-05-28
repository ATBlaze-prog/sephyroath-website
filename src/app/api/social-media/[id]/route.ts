/**
 * Individual Social Media Link API Route
 * GET: Fetch single social media link
 * PUT: Update social media link (Admin/Owner only)
 * DELETE: Delete social media link (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const link = await prisma.socialMediaLink.findUnique({
      where: { id: params.id },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Social media link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('Error fetching social media link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media link' },
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
    debugLog('PUT /api/social-media/:id', (session as any)?.user?.role, params.id);

    const body = await request.json();
    const { url, isEnabled, order } = body;

    const link = await prisma.socialMediaLink.update({
      where: { id: params.id },
      data: {
        url: url || undefined,
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('Error updating social media link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update social media link' },
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
    debugLog('DELETE /api/social-media/:id', (session as any)?.user?.role, params.id);

    // Fetch link before deletion for audit log
    const link = await prisma.socialMediaLink.findUnique({
      where: { id: params.id },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Social media link not found' },
        { status: 404 }
      );
    }

    await prisma.socialMediaLink.delete({
      where: { id: params.id },
    });

    // Log audit event for deletion
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE_SOCIAL_MEDIA_LINK',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        previousState: link,
        newState: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Social media link deleted' });
  } catch (error) {
    console.error('Error deleting social media link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete social media link' },
      { status: 500 }
    );
  }
}
