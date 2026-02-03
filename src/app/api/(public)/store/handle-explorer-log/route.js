import { HandleResponse, methodNotAllowedResponse } from '@api/route';
import { withRateLimit } from '@utils/rateLimit';
import prisma from '@lib/prisma';
import { replaceNonEnglishChar } from '@utils/sanitizer';

const limited = withRateLimit({
  max: 1,
  windowMs: 60_000,
});

export const POST = limited(async (req) => {
  let { storeId, tableId, source, ipAddress } = await req.json();

  storeId = replaceNonEnglishChar({
    text: storeId,
  });
  tableId = replaceNonEnglishChar({
    text: tableId,
  });
  source = replaceNonEnglishChar({
    text: source,
  });
  ipAddress = replaceNonEnglishChar({
    text: ipAddress,
    colon: true,
  });

  try {
    await prisma.storeExplorerLog.create({
      data: {
        storeId,
        tableId: tableId || null,
        source,
        ipAddress,
      },
    });
  } catch {}

  return HandleResponse({
    ok: true,
    status: 200,
    message: 'SUCCESS',
  });
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};
