// For branch stores, the UI prevents users from adding items.
// However, any requests sent to the API are still accepted and stored in the database.
// When displaying items on the website, only the parent store's items are shown,
// effectively overriding any branch store items.

import prisma from '@lib/prisma';
import { auth } from '@utils/auth/NextAuth';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import { toBoolean } from '@utils/sanitizer';
import { storeItemsCategoriesKey } from '@lib/prismaEnums';

const limited = withRateLimit({ max: 10, windowMs: 60_000 });

export const GET = async () => HandleResponse(methodNotAllowedResponse);

export const POST = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    let {
      id = undefined,
      storeId = undefined,
      category = undefined,
      title = '',
      description = '',
      price = 0,
      discountPercent = 0,
      imageUrl = null,
      isAvailable = true,
      isActive = true,
      options = [],
    } = await req.json();

    title = title.trim();
    description = description.trim();

    if (
      !storeId ||
      !category ||
      !storeItemsCategoriesKey.includes(category) ||
      typeof title !== 'string' ||
      title.length > 60 ||
      typeof description !== 'string' ||
      description.length > 200 ||
      typeof price !== 'number' ||
      typeof discountPercent !== 'number' ||
      typeof isAvailable !== 'boolean' ||
      typeof isActive !== 'boolean'
    ) {
      return HandleResponse({
        ok: false,
        status: 400,
        message: 'INVALID_INPUT',
      });
    }

    if (options) {
      options.forEach((option) => {
        if (
          typeof option?.title !== 'string' ||
          option.title.trim().length > 60 ||
          typeof option?.isRequired !== 'boolean' ||
          typeof option?.minSelect !== 'number' ||
          typeof option?.maxSelect !== 'number' ||
          (option.isRequired && option.minSelect <= 0) ||
          (!option.isRequired && option.minSelect != 0) ||
          option.maxSelect <= 0 ||
          option.maxSelect < option.minSelect ||
          typeof option?.price !== 'number' ||
          typeof option.price < 0 ||
          typeof option?.discountPercent !== 'number' ||
          typeof option.discountPercent < 0 ||
          typeof option.discountPercent > 100 ||
          typeof option?.isActive !== 'boolean'
        ) {
          return HandleResponse({
            ok: false,
            status: 400,
            message: 'INVALID_INPUT',
          });
        }
      });
    }

    if (id && id !== 'new') {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.storeItem.update({
            where: { id, userId },
            data: {
              category,
              title,
              description,
              price,
              discountPercent,
              imageUrl: imageUrl || null,
              isAvailable: toBoolean(isAvailable),
              isActive: toBoolean(isActive),
            },
          });

          await tx.storeItemOption.deleteMany({
            where: { itemId: id, userId },
          });

          if (options?.length) {
            const sanitizedOptions = options.map((opt) => ({
              userId,
              itemId: id,
              title: opt.title,
              isRequired: opt.isRequired,
              minSelect: opt.minSelect,
              maxSelect: opt.maxSelect,
              price: opt.price,
              discountPercent: opt.discountPercent,
              isActive: opt.isActive,
            }));

            await tx.storeItemOption.createMany({
              data: sanitizedOptions,
            });
          }
        });

        return HandleResponse({
          ok: true,
          status: 200,
          result: { itemId: id },
          message: 'UPDATED_SUCCESSFULLY',
        });
      } catch (e) {
        return HandleResponse({
          ...methodFailedOnTryResponse,
          devMessage: 'ADSSI3: ' + e.message,
        });
      }
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const item = await tx.storeItem.create({
          data: {
            userId,
            storeId,
            category,
            title,
            description,
            price,
            discountPercent,
            imageUrl: imageUrl || null,
            isAvailable: toBoolean(isAvailable),
            isActive: toBoolean(isActive),
          },
        });

        if (options?.length) {
          const sanitizedOptions = options.map((opt) => ({
            userId,
            itemId: item.id,
            title: opt.title,
            isRequired: opt.isRequired,
            minSelect: opt.minSelect,
            maxSelect: opt.maxSelect,
            price: opt.price,
            discountPercent: opt.discountPercent,
            isActive: opt.isActive,
          }));

          await tx.storeItemOption.createMany({
            data: sanitizedOptions,
          });
        }

        return item;
      });

      return HandleResponse({
        ok: true,
        status: 201,
        message: 'CREATED_SUCCESSFULLY',
        result: { itemId: result.id },
      });
    } catch (e) {
      return HandleResponse({
        ...methodFailedOnTryResponse,
        devMessage: 'ADSSI2: ' + e.message,
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSSI1: ' + e.message,
    });
  }
});

export const DELETE = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const { storeId } = await req.json();
    if (!storeId)
      return HandleResponse({
        ok: false,
        status: 400,
        message: 'INVALID_INPUT',
      });

    await prisma.storeItem.delete({ where: { id: storeId, userId } });

    return HandleResponse({
      ok: true,
      status: 200,
      message: 'DELETED_SUCCESSFULLY',
    });
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADSSID1: ' + e.message,
    });
  }
});
