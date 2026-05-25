/**
 * API endpoint for managing asset configurations
 * GET /api/assets/:key - Get asset URL by key
 * POST /api/assets - Create/update asset
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const params = await context.params;
  try {
    const config = await prisma.assetConfig.findUnique({
      where: { key: params.key },
    });

    if (!config) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    const body = await request.json();
    const { key, valueUrl } = body;

    if (!key || !valueUrl) {
      return NextResponse.json(
        { error: 'Key and valueUrl are required' },
        { status: 400 }
      );
    }

    const config = await prisma.assetConfig.upsert({
      where: { key },
      update: { valueUrl, updatedAt: new Date() },
      create: { key, valueUrl },
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create/update asset' },
      { status: 500 }
    );
  }
}
