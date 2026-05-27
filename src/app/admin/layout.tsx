/**
 * Admin Dashboard Layout
 */

import AdminLayout from '@/components/admin/Layout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
