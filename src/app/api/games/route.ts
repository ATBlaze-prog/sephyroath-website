/**
 * API route for managing games.
 * Route: /api/games
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const game = await prisma.game.create({
      data: {
        title: body.title,
        slug: body.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]/g, '-'),
        description: body.description,
        bannerUrl: body.bannerUrl,
        websiteUrl: body.websiteUrl,
        isActive: true,
        recruitmentStatus: body.recruitmentStatus ?? true,
        competitiveEnabled: body.competitiveEnabled ?? true,
        casualEnabled: body.casualEnabled ?? true,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await prisma.game.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        bannerUrl: body.bannerUrl,
        websiteUrl: body.websiteUrl,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const deleted = await prisma.game.delete({ where: { id: body.id } });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
