import { unstable_cache } from 'next/cache';
import {
  HandleResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import { replaceInvalidSearchInput } from '@utils/replaceInvalidSearchInput';
import { reportInternalErrors } from '@server/reportInternalErrors';
import prisma from '@lib/prisma';

const limited = withRateLimit({
  max: 120,
  windowMs: 60_000,
});

const CACHE_TIME = process.env.NODE_ENV === 'production' ? 600 : 1;
const PAGE_SIZE = 6;

const getStoresCached = ({ page = 1, slug = '', search = '' }) =>
  unstable_cache(
    async () => {
      try {
        if (slug) {
          const rows = await prisma.store.findFirst({
            select: {
              id: true,
              name: true,
              description: true,
              slug: true,
              currency: true,
              taxEnabled: true,
              taxIncluded: true,
              taxPercent: true,
              location: {
                select: {
                  countryLocal: true,
                  provinceLocal: true,
                },
              },
              logoUrl: true,
              categories: {
                select: {
                  key: true,
                },
              },
              items: {
                select: {
                  id: true,
                  category: true,
                  title: true,
                  description: true,
                  price: true,
                  discountPercent: true,
                  imageUrl: true,
                  isAvailable: true,
                  isActive: true,
                  options: {
                    select: {
                      id: true,
                      title: true,
                      isRequired: true,
                      minSelect: true,
                      maxSelect: true,
                      price: true,
                      discountPercent: true,
                      isActive: true,
                    },
                  },
                },
              },
              workingHours: {
                select: {
                  id: true,
                  dayOfWeek: true,
                  openTime: true,
                  closeTime: true,
                  isClosed: true,
                  is24Hours: true,
                },
              },
              isActive: true,
            },
            where: {
              slug,
            },
          });

          if (!rows || rows.length === 0) {
            return {
              ok: false,
              status: 404,
              message: 'STORE_NOT_FOUND',
            };
          }

          return {
            ok: true,
            status: 200,
            result: rows?.isActive ? rows : { ...rows, items: {} },
          };
        }

        let totalItems = 0;
        let totalPages = 1;

        try {
          totalItems = await prisma.store.count({
            where: { isActive: true },
          });
          totalPages = Math.ceil(totalItems / PAGE_SIZE);
        } catch {
          totalItems = 0;
          totalPages = 1;
        }

        const filteredSearch = String(replaceInvalidSearchInput(search).trim());
        const searchLower = filteredSearch.toLowerCase();

        page = page > totalPages ? totalPages : page;
        const skip = (page - 1) * PAGE_SIZE;

        let where = { isActive: true };

        if (searchLower) {
          where.OR = [
            { name: { contains: searchLower, mode: 'insensitive' } },
            { slug: { contains: searchLower, mode: 'insensitive' } },
          ];
        }

        const data = await prisma.store.findMany({
          where,
          orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
          skip,
          take: PAGE_SIZE,
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            address: true,
            location: {
              select: {
                countryLocal: true,
                provinceLocal: true,
              },
            },
            logoUrl: true,
            categories: {
              select: {
                key: true,
              },
            },
          },
        });

        return {
          ok: true,
          status: 200,
          result: {
            data,
            current_page: page,
            total_items: totalItems,
            total_pages: totalPages,
          },
        };
      } catch (e) {
        reportInternalErrors({
          type: 'danger',
          section: 'api/public/stores',
          message: 'Fetching Stores Failed: ' + e.message,
        });
        return {
          ...methodFailedOnTryResponse,
          devMessage: 'AS1 ' + e,
        };
      }
    },
    search
      ? ['stores', `search:${search}`]
      : slug
        ? ['stores', `slug:${slug}`]
        : ['stores', `page:${page}`],
    { revalidate: CACHE_TIME },
  )();

export const POST = limited(async (req) => {
  const body = await req.json().catch(() => ({}));
  const page = Math.max(Number(body?.page || 1) || 1, 1);
  const slug = body?.slug || '';
  const search = body?.search || '';

  const data = await getStoresCached({ search, page, slug });
  return HandleResponse(data);
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};
