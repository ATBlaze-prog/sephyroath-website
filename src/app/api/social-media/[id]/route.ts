/**
 * Individual Social Media Link API Route
 * GET: Fetch single social media link
 * PUT: Update social media link (Admin/Owner only)
 * DELETE: Delete social media link (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requireAdminAccess } from '@/lib/rbac';
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

    if (!user || !requireAdminAccess(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

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

    if (!user || !requireAdminAccess(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    await prisma.socialMediaLink.delete({
      where: { id: params.id },
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
