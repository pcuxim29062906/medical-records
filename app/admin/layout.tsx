import { requireUser } from '@/app/actions/auth/auth';
import AdminShell from './admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
