/**
 * Social Media Links API Route
 * GET: Fetch all social media links
 * POST: Create new social media link (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requireAdminAccess } from '@/lib/rbac';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enabled = searchParams.get('enabled');

    const where: any = {};
    if (enabled === 'true') {
      where.isEnabled = true;
    } else if (enabled === 'false') {
      where.isEnabled = false;
    }

    const links = await prisma.socialMediaLink.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error('Error fetching social media links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { platform, url, isEnabled, order } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (platform, url)' },
        { status: 400 }
      );
    }

    // Check if platform already exists
    const existing = await prisma.socialMediaLink.findUnique({
      where: { platform },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Social media link for this platform already exists' },
        { status: 400 }
      );
    }

    const link = await prisma.socialMediaLink.create({
      data: {
        platform,
        url,
        isEnabled: isEnabled !== false,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: link }, { status: 201 });
  } catch (error) {
    console.error('Error creating social media link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create social media link' },
      { status: 500 }
    );
  }
}
