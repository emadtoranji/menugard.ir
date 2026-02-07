import { HandleResponse, methodFailedOnTryResponse } from '@api/route';
import prisma from '@lib/prisma';
import { getT } from '@i18n/server';
import {
  generateVerifyToken,
  hourToSecond,
  numberToFarsi,
} from '@utils/numbers';
import { withRateLimit } from '@utils/rateLimit';
import { isValidQualityEmail, normalizeEmail } from '@utils/validationEmail';
import bcrypt from 'bcryptjs';
import { generatePassword } from '@utils/generatePassowrd';
import { generateHtmlEmailSingleButtons } from '@utils/generateHtmlEmailSingleButtons';
import sendMail from '@server/email';
import { BaseUrlAddress } from '@utils/globalSettings';
import { fallbackLng, languages } from '@i18n/settings';
import { reportInternalErrors } from '@server/reportInternalErrors';
import { signOut } from '@utils/auth/NextAuth';
import { replaceNonEnglishChar } from '@utils/sanitizer';

const limited = withRateLimit({
  max: 3,
  windowMs: 60_000,
});

async function handle_reset_password_send_email({
  rawEmail,
  language,
  t,
  tResetEmail,
}) {
  const email = normalizeEmail(rawEmail);

  if (!email || !isValidQualityEmail(email)) {
    return {
      ok: false,
      message: 'INVALID_EMAIL',
      status: 400,
    };
  }

  const user_data = await prisma.user.findFirst({
    where: { email },
    select: { email: true },
  });

  if (!user_data?.email) {
    return {
      ok: true,
      message: 'SEND_EMAIL_SUCCESS',
      status: 200,
    };
  }

  const nowDate = Date.now();
  const expires = new Date(nowDate + hourToSecond(3) * 1000);
  const token = generateVerifyToken();

  try {
    await prisma.verificationToken.upsert({
      where: { identifier: user_data.email },
      update: { token, expires },
      create: { identifier: user_data.email, token, expires },
    });
  } catch (e) {
    return {
      ok: false,
      message: 'DATABASE_ERROR',
      status: 500,
      devMessage: 'Insert/Update Error',
    };
  }

  const verifyUrl = `${BaseUrlAddress}${language}/reset-password?token=${token}`;
  const AppName = t('general.app-name');
  const dateYear = numberToFarsi(new Date().getFullYear(), language);
  const subject = tResetEmail('html.subject');
  const finalHTML = generateHtmlEmailSingleButtons({
    language,
    subject,
    message: tResetEmail('html.description'),
    buttonTitle: tResetEmail('html.button-title'),
    buttonUrl: verifyUrl,
    note: tResetEmail('html.expire-time'),
    footer: tResetEmail('html.if-its-not-you'),
    signature: `${AppName} © ${dateYear}`,
  });

  let sent = { ok: false };
  try {
    sent = await sendMail({
      displayName: AppName,
      to: email,
      subject,
      html: finalHTML,
    });
  } catch (e) {
    return {
      ok: false,
      status: 500,
      message: 'SEND_EMAIL_FAILED',
      devMessage: e?.message || null,
    };
  }

  if (sent.ok === true) {
    return { ok: true, status: 200, message: 'SEND_EMAIL_SUCCESS' };
  } else {
    return {
      ok: false,
      status: 500,
      message: sent?.message || 'SEND_EMAIL_FAILED',
      devMessage: sent?.devMessage,
    };
  }
}

async function handle_reset_password_token_check({ rawToken }) {
  const token = replaceNonEnglishChar({
    text: rawToken,
    colon: false,
  });

  const verification_data = await prisma.verificationToken.findFirst({
    where: {
      token,
      expires: { gt: new Date() },
    },
    select: { identifier: true },
  });

  if (!verification_data?.identifier) {
    return {
      ok: true,
      status: 404,
      message: 'LINK_IS_EXPIRED',
    };
  }

  const newPassword = generatePassword();
  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(newPassword, 12);
  } catch (e) {
    return {
      ok: false,
      status: 500,
      message: 'INTERNAL_ERROR',
    };
  }

  if (!passwordHash) {
    return {
      ok: false,
      status: 500,
      message: 'INTERNAL_ERROR',
    };
  }

  try {
    await prisma.user.update({
      where: { email: verification_data.identifier },
      data: { passwordHash },
    });

    await signOut({ redirect: false });

    await prisma.verificationToken.delete({
      where: { identifier: verification_data.identifier },
    });

    return {
      ok: true,
      status: 200,
      result: { newPassword },
      message: 'SUCCESS',
    };
  } catch (e) {
    return {
      ok: false,
      status: 500,
      message: 'INTERNAL_ERROR',
    };
  }
}

export const POST = limited(async (req) => {
  try {
    const {
      email: rawEmail,
      language: rawLanguage = undefined,
      token: rawToken,
    } = await req.json();

    let language = String(rawLanguage).toLowerCase();
    if (!languages.includes(language)) {
      language = fallbackLng;
    }

    const { t, lng: currentLang } = await getT(language);
    const { t: tResetEmail } = await getT(language, 'reset-password');

    if (rawToken) {
      return HandleResponse(
        await handle_reset_password_token_check({
          rawToken,
        }),
      );
    } else {
      return HandleResponse(
        await handle_reset_password_send_email({
          rawEmail,
          currentLang,
          t,
          tResetEmail,
        }),
      );
    }
  } catch (e) {
    reportInternalErrors({
      type: 'danger',
      section: 'api/auth/reset-password',
      message: e.message,
    });
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: e.message,
    });
  }
});
