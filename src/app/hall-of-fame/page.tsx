import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

const CATEGORY_LABELS: Record<string, string> = {
  MAJOR_TOURNAMENT_CHAMPION: 'Major Tournament Champion',
  SCRIMMAGE_CHAMPION: 'Scrimmage Champion',
  HOME_SCRIM_CHAMPION: 'Home Scrim Champion',
  MVP: 'MVP',
  BEST_RECRUITER: 'Best Recruiter',
  CLAN_CONTRIBUTOR: 'Clan Contributor',
  CLAN_VETERAN: 'Clan Veteran',
  SPECIAL_RECOGNITION: 'Special Recognition',
};

export default async function HallOfFamePage() {
  const achievements = await prisma.hallOfFameAchievement.findMany({
    include: {
      memberProfile: {
        select: {
          id: true,
          inGameName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      awardedDate: 'desc',
    },
  });

  const session = await getServerAuthSession();
  const canManage = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role);

  // Group achievements by category
  const achievementsByCategory = achievements.reduce(
    (acc, achievement) => {
      const category = achievement.category as string;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    },
    {} as Record<string, typeof achievements>
  );

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <div className="mb-12">
          <h1 className="section-title">Hall of <span className="text-gradient">Fame</span></h1>
          <p className="text-so-gray-300 max-w-2xl">
            Celebrate the legends, champions, and heroes of the SephyrOath gaming community.
          </p>
        </div>

        {canManage && (
          <div className="mb-8">
            <a
              href="/admin/hall-of-fame"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Manage Hall of Fame →
            </a>
          </div>
        )}

        {achievements.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-4">No achievements recorded yet.</p>
            <p>Legends are still being made...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
              <div key={category}>
                <h2 className="text-3xl font-bold text-purple-400 mb-6">
                  {CATEGORY_LABELS[category] || category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
                    >
                      {achievement.imageUrl && (
                        <div className="w-full h-48 bg-gray-700 relative">
                          <img
                            src={achievement.imageUrl}
                            alt={achievement.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                        <p className="text-sm text-purple-400 mb-3">
                          {achievement.memberProfile?.inGameName}
                        </p>
                        {achievement.description && (
                          <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Awarded on {new Date(achievement.awardedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
