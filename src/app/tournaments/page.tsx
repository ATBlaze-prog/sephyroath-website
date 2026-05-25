import PinnedCardGrid from '@/components/pins/PinnedCardGrid';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [
      { isPinned: 'desc' },
      { startDate: 'desc' },
    ],
  });

  const pinnedTournaments = tournaments.map((tournament) => ({
    id: tournament.id,
    title: tournament.title,
    description: tournament.description,
    bannerUrl: tournament.bannerUrl,
    startDate: tournament.startDate.toISOString(),
    isPinned: tournament.isPinned,
  }));

  const session = await getServerAuthSession();
  const canManage = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role) && session.user.accountStatus === 'ACTIVE';

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <div className="mb-12">
          <h1 className="section-title">Competitive <span className="text-gradient">Tournaments</span></h1>
          <p className="text-so-gray-300 max-w-2xl">
            Padded tournament cards with pin-to-top controls for admin prioritized announcements.
          </p>
        </div>
        <PinnedCardGrid items={pinnedTournaments} canManage={canManage} resource="tournaments" />
      </div>
    </div>
  );
}
