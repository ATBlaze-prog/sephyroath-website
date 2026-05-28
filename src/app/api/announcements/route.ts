/**
 * Announcements API Route
 * GET: Fetch all announcements
 * POST: Create new announcement (Admin/Owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { requireAdminOrOwner, debugLog } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const where: any = {};
    if (published === 'true') {
      where.isPublished = true;
    } else if (published === 'false') {
      where.isPublished = false;
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: {
        publishedAt: 'desc',
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

    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
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
    debugLog('POST /api/announcements by', (session as any)?.user?.role);
    const body = await request.json();
    const { title, content, featuredImage, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, content)' },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        featuredImage,
        author: user.id,
        isPublished: isPublished || false,
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

    return NextResponse.json({ success: true, data: announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
