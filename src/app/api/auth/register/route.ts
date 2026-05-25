import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { UserRole, AccountStatus } from '@prisma/client';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  realName: z.string().nullable().optional(),
  age: z.number().int().positive().nullable().optional(),
  joinedAt: z.preprocess((value) => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    return undefined;
  }, z.date().optional()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod now handles the date conversion via preprocess
    const parsed = registerSchema.parse(body);

    const hashedPassword = await hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password_hash: hashedPassword,
        realName: parsed.realName ?? null,
        age: parsed.age ?? null,
        joinedAt: parsed.joinedAt,
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.PENDING,
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Error registering admin', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register admin' }, { status: 500 });
  }
}
