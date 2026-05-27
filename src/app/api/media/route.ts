/**
 * Media upload API route using Cloudinary and Prisma storage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { requireAdminAccess } from '@/lib/rbac';
import { UserRole } from '@prisma/client';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error('Error fetching media assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || !requireAdminAccess(user.role as UserRole)) {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Unsupported image format' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadImageToCloudinary(buffer, file.name);

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url: uploadResult.secure_url || uploadResult.url || '',
        publicId: uploadResult.public_id || file.name,
        mimeType: file.type,
        size: buffer.length,
        width: uploadResult.width ? Number(uploadResult.width) : undefined,
        height: uploadResult.height ? Number(uploadResult.height) : undefined,
        uploadedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error('Error uploading media asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload media asset' }, { status: 500 });
  }
}
