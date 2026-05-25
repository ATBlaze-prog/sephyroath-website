import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

const applicationSchema = z.object({
  fullName: z.string().min(1).max(50),
  age: z.number().int().positive(),
  gender: z.enum(['Male', 'Female', 'Others']),
  location: z.string().min(1).max(100),
  facebookProfileUrl: z.string().url(),
  tiktokProfileUrl: z.string().url(),
  facebookProofUrl: z.string().min(1),
  tiktokProofUrl: z.string().min(1),
  gameId: z.string().min(1),
  currentIgn: z.string().min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.parse(body);
    const session = await getServerAuthSession();

    const application = await prisma.application.create({
      data: {
        fullName: parsed.fullName,
        age: parsed.age,
        gender: parsed.gender,
        location: parsed.location,
        facebookProfileUrl: parsed.facebookProfileUrl,
        tiktokProfileUrl: parsed.tiktokProfileUrl,
        facebookProofUrl: parsed.facebookProofUrl,
        tiktokProofUrl: parsed.tiktokProofUrl,
        currentIgn: parsed.currentIgn,
        game: { connect: { id: parsed.gameId } },
        user: session?.user?.id ? { connect: { id: session.user.id } } : undefined,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Recruitment submission error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
