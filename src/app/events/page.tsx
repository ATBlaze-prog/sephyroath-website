import PinnedCardGrid from '@/components/pins/PinnedCardGrid';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: [
      { isPinned: 'desc' },
      { startTime: 'desc' },
    ],
  });

  const pinnedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    bannerUrl: event.imageUrl,
    startDate: event.startTime.toISOString(),
    isPinned: event.isPinned,
  }));

  const session = await getServerAuthSession();
  const canManage = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role) && session.user.accountStatus === 'ACTIVE';

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <div className="mb-12">
          <h1 className="section-title">Upcoming <span className="text-gradient">Events</span></h1>
          <p className="text-so-gray-300 max-w-2xl">
            Event cards with pinned highlights and scheduling details for the SephyrOath feed.
          </p>
        </div>
        <PinnedCardGrid items={pinnedEvents} canManage={canManage} resource="events" />
      </div>
    </div>
  );
}
