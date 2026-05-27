/**
 * Individual media asset route for retrieval and deletion.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { requireAdminAccess } from '@/lib/rbac';
import { UserRole } from '@prisma/client';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: params.id } });
    if (!asset) {
      return NextResponse.json({ success: false, error: 'Media asset not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error fetching media asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch media asset' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || !requireAdminAccess(user.role as UserRole)) {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id: params.id } });
    if (!asset) {
      return NextResponse.json({ success: false, error: 'Media asset not found' }, { status: 404 });
    }

    await deleteImageFromCloudinary(asset.publicId);
    await prisma.mediaAsset.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (error) {
    console.error('Error deleting media asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media asset' }, { status: 500 });
  }
}
