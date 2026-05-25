import GameGrid from '@/components/games/GameGrid';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export default async function GamesPage() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const session = await getServerAuthSession();
  const canManage = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role) && session.user.accountStatus === 'ACTIVE';

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="section-title">Our <span className="text-gradient">Games</span></h1>
            <p className="text-so-gray-300 max-w-2xl">
              Dynamic game cards, official links, and admin CRUD support for live entries.
            </p>
          </div>
        </div>
        <GameGrid initialGames={games} canManage={canManage} />
      </div>
    </div>
  );
}
