import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ApplicationInbox from '@/components/admin/ApplicationInbox';

export default async function AdminInboxPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role) || session.user.accountStatus !== 'ACTIVE') {
    redirect('/auth/login');
  }

  const applications = (await prisma.application.findMany({
    orderBy: { appliedAt: 'desc' },
    include: { game: true },
  })) as any[];

  const initialApplications = applications.map((application: any) => ({
    id: application.id,
    fullName: application.fullName,
    age: application.age,
    gender: application.gender,
    location: application.location,
    discordUsername: application.discordUsername,
    facebookProfileUrl: application.facebookProfileUrl,
    tiktokProfileUrl: application.tiktokProfileUrl,
    facebookProofUrl: application.facebookProofUrl,
    tiktokProofUrl: application.tiktokProofUrl,
    currentIgn: application.currentIgn,
    status: application.status,
    appliedAt: application.appliedAt.toISOString(),
    game: application.game ? { title: application.game.title } : null,
  }));

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <ApplicationInbox initialApplications={initialApplications} />
      </div>
    </div>
  );
}
