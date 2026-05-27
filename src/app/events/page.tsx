import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: {
      startTime: 'desc',
    },
    include: {
      creator: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  const session = await getServerAuthSession();
  const canManage = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role);

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <div className="mb-12">
          <h1 className="section-title">Upcoming <span className="text-gradient">Events</span></h1>
          <p className="text-so-gray-300 max-w-2xl">
            Join SephyrOath for exciting events, scrimmages, tournaments, and community gatherings.
          </p>
        </div>

        {canManage && (
          <div className="mb-8">
            <a
              href="/admin/events"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Manage Events →
            </a>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No events scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
              >
                {event.bannerUrl && (
                  <div className="w-full h-48 bg-gray-700 relative">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-sm text-purple-400 mb-3">{event.eventType}</p>
                  {event.description && (
                    <p className="text-gray-300 text-sm mb-4">{event.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>
                      📅 {new Date(event.startTime).toLocaleDateString()} at{' '}
                      {new Date(event.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.location && <p>📍 {event.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
