/**
 * Announcements API Route
 * GET: Fetch all announcements
 * POST: Create new announcement (Admin/Owner only)
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
