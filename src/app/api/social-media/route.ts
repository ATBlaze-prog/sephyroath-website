/**
 * Social Media Links API Route
 * GET: Fetch all social media links
 * POST: Create new social media link (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';

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
    const session = await getServerAuthSession();
    const authResp = requireAdminOrOwner(session as any);
    if (authResp) return authResp;

    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    debugLog('POST /api/social-media', (session as any)?.user?.role, user?.id);
    const body = await request.json();
    const { platform, url, isEnabled, order } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (platform, url)' },
        { status: 400 }
      );
    }

    // Allow multiple links per platform - removed unique constraint check
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
