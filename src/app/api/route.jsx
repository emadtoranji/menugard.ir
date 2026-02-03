import { NextResponse } from 'next/server';

export async function HandleResponse({
  ok = false,
  result = {},
  message = '',
  status = 0,
  meta = undefined,
  devMessage = undefined,
  headers = {},
}) {
  return NextResponse.json(
    {
      ok,
      code: status,
      result,
      meta: typeof meta === 'object' ? meta : undefined,
      message: message ? message : ok ? 'SUCCESS' : 'UNKNOWN',
      devMessage:
        devMessage && process.env.NODE_ENV !== 'production'
          ? devMessage
          : undefined,
    },
    {
      status: status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        Vary: 'Accept-Encoding',
        ...headers,
      },
    },
  );
}

export const methodNotFound = {
  ok: false,
  message: 'THE_REQUESTED_ENDPOINT_DOES_NOT_EXISTS',
  status: 404,
  devMessage: '',
};

export const methodOnlyWorksWithJson = {
  ok: false,
  message: 'THIS_ENDPOINT_ONLY_ACCEPTS_REQUESTS_WITH_VALID_JSON_IN_THE_BODY',
  status: 400,
  devMessage: '',
};

export const methodNotAllowedResponse = {
  ok: false,
  message: 'THIS_METHOD_HTTP_IS_NOT_SUPPORTED_ON_THIS_ENDPOINT',
  status: 405,
  devMessage: '',
};

export const methodAuthenticationRequiredResponse = {
  ok: false,
  message: 'AUTHENTICATION_REQUIRED',
  status: 401,
  devMessage: '',
};

export const methodFailedOnTryResponse = {
  ok: false,
  message: 'INTERNAL_ERROR',
  status: 500,
  devMessage: '',
};

export const methodAccessDeniedResponse = {
  ok: false,
  message: 'ACCESS_DENIED',
  status: 403,
  devMessage: '',
};

export const methodIsNotEnableResponse = {
  ok: false,
  message: 'THIS_ENDPOINT_IS_CURRENTLY_DISABLED',
  status: 403,
  devMessage: '',
};

export const v1ApiKeyNotFound = {
  ok: false,
  message: 'API_KEY_NOT_FOUND',
  status: 400,
};

export async function GET(req) {
  return HandleResponse(methodNotFound);
}
export async function HEAD(req) {
  return HandleResponse(methodNotFound);
}
export async function POST(req) {
  return HandleResponse(methodNotFound);
}
export async function PUT(req) {
  return HandleResponse(methodNotFound);
}
export async function DELETE(req) {
  return HandleResponse(methodNotFound);
}
export async function PATCH(req) {
  return HandleResponse(methodNotFound);
}
export async function OPTIONS(req) {
  return HandleResponse(methodNotFound);
}
