import MemberDirectory from '@/components/members/MemberDirectory';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export default async function MembersPage() {
  const members = (await prisma.member.findMany({
    orderBy: { joinedAt: 'desc' },
    include: { game: true },
  })) as any[];
  const initialMembers = members.map((member: any) => ({
    id: member.id,
    ign: member.ign,
    gender: member.gender,
    joinedAt: member.joinedAt.toISOString(),
    game: member.game ? { title: member.game.title } : null,
  }));
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: { title: 'asc' },
    select: { id: true, title: true },
  });

  const session = await getServerAuthSession();
  const canManage = !!session?.user?.role && ['ADMIN', 'OWNER'].includes(session.user.role) && session.user.accountStatus === 'ACTIVE';

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <MemberDirectory initialMembers={initialMembers} games={games} canManage={canManage} />
      </div>
    </div>
  );
}
