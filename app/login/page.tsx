import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth/auth';
import LoginForm from './login-form';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/admin');
  }

  return <LoginForm />;
}
