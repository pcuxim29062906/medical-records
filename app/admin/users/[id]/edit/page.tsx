import UserForm from '@/components/users/UserForm';
import { getUserById } from '@/app/actions/auth/user';
import { notFound } from 'next/navigation';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return <UserForm mode="edit" user={user} />;
}
