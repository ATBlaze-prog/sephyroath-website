import { prisma } from '@/lib/prisma';
import RecruitmentForm from '@/components/recruitment/RecruitmentForm';

export default async function RecruitmentPage() {
  const games = await prisma.game.findMany({
    where: { isActive: true, recruitmentStatus: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <div className="mb-12">
          <h1 className="section-title">Recruitment <span className="text-gradient">Questionnaire</span></h1>
          <p className="text-so-gray-300 max-w-2xl">
            Apply with your full profile, proof screenshots, and target game details. Every field is required and reviewed by our admin team.
          </p>
        </div>
        <RecruitmentForm games={games} />
      </div>
    </div>
  );
}

