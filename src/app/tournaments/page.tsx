import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: 'UPCOMING',
    },
    orderBy: {
      startDate: 'asc',
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
          <h1 className="section-title">Competitive <span className="text-gradient">Tournaments</span></h1>
          <p className="text-so-gray-300 max-w-2xl">
            Compete in SephyrOath tournaments and showcase your skills against the best players in our community.
          </p>
        </div>

        {canManage && (
          <div className="mb-8">
            <a
              href="/admin/tournaments"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Manage Tournaments →
            </a>
          </div>
        )}

        {tournaments.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No tournaments scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
              >
                {tournament.bannerUrl && (
                  <div className="w-full h-48 bg-gray-700 relative">
                    <img
                      src={tournament.bannerUrl}
                      alt={tournament.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tournament.title}</h3>
                  <p className="text-sm text-purple-400 mb-3">Status: {tournament.status}</p>
                  {tournament.description && (
                    <p className="text-gray-300 text-sm mb-4">{tournament.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <p>
                      📅 {new Date(tournament.startDate).toLocaleDateString()}
                    </p>
                    {tournament.prizePool && <p>💰 Prize Pool: {tournament.prizePool}</p>}
                    {tournament.maxTeams && <p>👥 Max Teams: {tournament.maxTeams}</p>}
                  </div>
                  {tournament.registrationLink && (
                    <a
                      href={tournament.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
