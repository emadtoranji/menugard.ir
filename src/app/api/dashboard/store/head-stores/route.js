import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import prisma from '@lib/prisma';

const limited = withRateLimit({
  max: 10,
  windowMs: 60_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const { exceptId } = await req.json();

    try {
      const where = {
        parentStoreId: null,
        ...(exceptId && {
          NOT: { id: exceptId },
        }),
      };

      const headStores = await prisma.store.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
      });

      if (headStores.length) {
        return HandleResponse({
          ok: true,
          status: 200,
          result: headStores,
        });
      } else {
        return HandleResponse({
          ok: true,
          status: 400,
          message: 'NO_HEAD_STORE',
        });
      }
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSHS2: ' + e.message,
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSHS1',
    });
  }
});
