import Forms from './Forms';
import AnimatedPage from '@components/AnimatedPage';
import prisma from '@lib/prisma';
import { auth } from '@utils/auth/NextAuth';
import { redirect } from 'next/navigation';

export default async function Index({ params }) {
  const { lng } = (await params) || {};

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/${lng}/signout`);
  }

  let user = undefined;
  try {
    user = await prisma.user.findUnique({
      select: {
        email: true,
        emailVerified: true,
        username: true,
        accessibility: true,
        status: true,
      },
      where: {
        id: userId,
      },
    });
  } catch {}

  return (
    <AnimatedPage>
      <div className='container-lg'>
        <Forms user={user} currentLang={lng} />
      </div>
    </AnimatedPage>
  );
}
