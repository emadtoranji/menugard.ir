import prisma from '@lib/prisma';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import StoreValidationForm from '@utils/dashboard/store/validation';
import { toBoolean } from '@utils/sanitizer';
import { isSlugTaken } from '../isSlugTaken';
import { isUUIDv4 } from '@utils/isUUID';
import { MAXIMUM_STORE_LIMIT_EXCESSES } from '@utils/globalSettings';

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

    let {
      isNewStore = undefined,
      id = undefined,
      name,
      description,
      slug,
      categories,
      country,
      province,
      address,
      phone,
      currency,
      tax,
      isActive,
    } = await req.json();

    if (isNewStore == '0') {
      if (!isUUIDv4(id)) {
        return HandleResponse({
          ok: false,
          message: 'INVALID_INPUT',
          status: 400,
          devMessage: 'invalid UUID',
        });
      }
    } else {
      const userStoreCount = prisma.store.count({
        where: {
          id,
          userId,
        },
      });
      if (userStoreCount >= MAXIMUM_STORE_LIMIT_EXCESSES) {
        return HandleResponse({
          ok: false,
          message: 'MAXIMUM_STORE_LIMIT_EXCESSES',
          status: 400,
          devMessage: `user has ${userStoreCount} stores`,
        });
      }
    }

    name = name.trim();
    description = description.trim();
    slug = slug.trim();
    address = address.trim();
    phone = phone.trim();
    tax.enable = toBoolean(tax.enable);
    tax.included = toBoolean(tax.included);
    isActive = toBoolean(isActive);

    const validationErros = StoreValidationForm({
      name,
      description,
      slug,
      categories,
      locations: undefined,
      country,
      province,
      address,
      phone,
      currency,
      tax,
    });

    if (Object.keys(validationErros).length !== 0) {
      return HandleResponse({
        ok: false,
        message: 'INVALID_INPUT',
        status: 400,
        devMessage: validationErros,
      });
    }

    const isSlugTakenResult = await isSlugTaken(slug);
    if (!isSlugTakenResult.ok) {
      return HandleResponse({
        ok: false,
        message: 'INTERNAL_ERROR',
        status: 500,
        devMessage: isSlugTakenResult?.devMessage || '',
      });
    }
    const taken = isSlugTakenResult.result.isTaken;
    if (taken) {
      const isEditingSameStore =
        !isNewStore &&
        isSlugTakenResult.result.userId === userId &&
        isSlugTakenResult.result.id === id;

      if (!isEditingSameStore) {
        return HandleResponse({
          ok: false,
          message: 'SLUG_IS_TAKEN',
          status: 400,
        });
      }
    }

    let locationId = undefined;
    try {
      const countryProvinceExists = await prisma.location.findFirst({
        select: {
          id: true,
        },
        where: {
          countrySlug: country,
          provinceSlug: province,
          isActive: true,
        },
      });

      if (!countryProvinceExists?.id) {
        return HandleResponse({
          ok: false,
          message: 'INVALID_INPUT',
          status: 400,
        });
      }
      locationId = countryProvinceExists.id;
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSNS4: ' + e.message,
      });
    }

    if (isNewStore) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const store = await tx.store.create({
            data: {
              userId,
              name,
              description,
              slug,
              locationId,
              address,
              phone,
              currency,
              taxEnabled: tax.enable,
              taxIncluded: tax.included,
              taxPercent: tax.enable ? parseInt(tax?.percent || 0) : 0,
              isActive,
            },
          });

          await tx.storeCategory.createMany({
            data: categories.map((c) => ({
              storeId: store.id,
              key: String(c).toLowerCase(),
            })),
          });

          return store.id;
        });

        return HandleResponse({
          ok: true,
          result: { id: result },
          status: 200,
        });
      } catch (e) {
        return HandleResponse({
          ...methodFailedOnTryResponse,
          devMessage: 'ADSNS6: ' + userId + ' ' + e.message,
        });
      }
    } else {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.store.update({
            where: {
              id,
              userId,
            },
            data: {
              userId,
              name,
              description,
              slug,
              locationId,
              address,
              phone,
              currency,
              taxEnabled: tax.enable,
              taxIncluded: tax.included,
              taxPercent: tax.enable ? parseInt(tax?.percent || 0) : 0,
              isActive,
            },
          });

          await tx.storeCategory.deleteMany({
            where: {
              storeId: id,
            },
          });

          if (categories?.length) {
            await tx.storeCategory.createMany({
              data: categories.map((c) => ({
                storeId: id,
                key: String(c).toLowerCase(),
              })),
            });
          }
        });

        return HandleResponse({
          ok: true,
          result: { id },
          status: 200,
        });
      } catch (e) {
        return HandleResponse({
          ...methodFailedOnTryResponse,
          devMessage: 'ADSNS5: ' + ' ' + e.message,
        });
      }
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSNS1: ' + e.message,
    });
  }
});
