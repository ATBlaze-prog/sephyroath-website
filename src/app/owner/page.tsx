import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OwnerAccountManager from '@/components/owner/OwnerAccountManager';

export default async function OwnerPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.role || session.user.role !== 'OWNER' || session.user.accountStatus !== 'ACTIVE') {
    redirect('/auth/login');
  }

  const admins = (await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'OWNER'] } },
    select: {
      id: true,
      email: true,
      realName: true,
      age: true,
      joinedAt: true,
      role: true,
      accountStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })) as any[];

  const initialAdmins = admins.map((admin: any) => ({
    id: admin.id,
    email: admin.email,
    realName: admin.realName,
    age: admin.age,
    joinedAt: admin.joinedAt ? admin.joinedAt.toISOString() : null,
    role: admin.role,
    accountStatus: admin.accountStatus,
    createdAt: admin.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen py-20">
      <div className="container-primary">
        <OwnerAccountManager admins={initialAdmins} />
      </div>
    </div>
  );
}
