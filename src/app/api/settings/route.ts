/**
 * Website settings route using AssetConfig storage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import { requireOwner, debugLog } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

const VALID_SETTING_KEYS = [
  'site_title',
  'site_description',
  'discord_invite',
  'global_banner_url',
  'global_logo_url',
];

export async function GET() {
  try {
    const settings = await prisma.assetConfig.findMany({
      where: { key: { in: VALID_SETTING_KEYS } },
      orderBy: { key: 'asc' },
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching website settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const authResp = requireOwner(session as any);
    if (authResp) return authResp;

    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    debugLog('POST /api/settings by', (session as any)?.user?.role);
    const body = await request.json();
    const { key, valueUrl } = body;

    if (!key || !VALID_SETTING_KEYS.includes(key)) {
      return NextResponse.json({ success: false, error: 'Invalid setting key' }, { status: 400 });
    }

    const config = await prisma.assetConfig.upsert({
      where: { key },
      update: { valueUrl, updatedAt: new Date() },
      create: { key, valueUrl },
    });

    return NextResponse.json({ success: true, data: config }, { status: 201 });
  } catch (error) {
    console.error('Error updating website settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update website settings' },
      { status: 500 }
    );
  }
}
