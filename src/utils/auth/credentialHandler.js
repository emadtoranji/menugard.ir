'use server';

import prisma from '@lib/prisma';
import bcrypt from 'bcryptjs';
import { containsUnsafeString, toBoolean } from '@utils/sanitizer';
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from '@utils/globalSettings';
import { verifyGoogleCatchaV3 } from '@server/verifyGoogleCatchaV3';
import { validateStrongPassword } from '@utils/validateStrongPassword';
import { isValidQualityEmail, normalizeEmail } from '@utils/validationEmail';

export async function credentialHandler(credentials) {
  try {
    const {
      signup: rawSignup = false,
      email: rawEmail = '',
      password = '',
      password_verify = '',
      captcha: rawCaptcha = '',
    } = credentials;

    const signup = toBoolean(rawSignup);
    const normalizedEmail = normalizeEmail(rawEmail);
    const captcha = String(rawCaptcha).trim();

    if (!captcha || !normalizedEmail || !password) {
      return { ok: false, message: 'MISSING_PARAMETERS' };
    }

    if (
      !isValidQualityEmail(normalizedEmail) ||
      containsUnsafeString(normalizedEmail, MAX_EMAIL_LENGTH)
    ) {
      return { ok: false, message: 'INVALID_EMAIL' };
    }

    if (containsUnsafeString(password, MAX_PASSWORD_LENGTH)) {
      return { ok: false, message: 'INVALID_INPUT' };
    }

    if (
      signup === true &&
      (!password_verify ||
        containsUnsafeString(password_verify, MAX_PASSWORD_LENGTH))
    ) {
      return { ok: false, message: 'INVALID_INPUT' };
    }

    if (signup === true) {
      if (password !== password_verify) {
        return { ok: false, message: 'PASSWORDS_DO_NOT_MATCH' };
      }
      if (!validateStrongPassword(password)) {
        return { ok: false, message: 'WEAK_PASSWORD' };
      }
    }

    if (process.env.NODE_ENV === 'production') {
      const captchaValid = await verifyGoogleCatchaV3(captcha);
      if (!captchaValid) {
        return { ok: false, message: 'CAPTCHA_IS_INVALID' };
      }
    }

    let existingUser = null;
    try {
      existingUser = await prisma.user.findFirst({
        where: { email: normalizedEmail },
        select: {
          id: true,
          email: true,
          accessibility: true,
          passwordHash: true,
        },
      });
    } catch {
      return { ok: false, message: 'INTERNAL_ERROR' };
    }

    // ───────────────── SIGNUP ─────────────────
    if (signup === true) {
      if (existingUser?.id) {
        return { ok: false, message: 'EMAIL_ALREADY_EXISTS' };
      }

      let passwordHash = null;
      try {
        passwordHash = await bcrypt.hash(password, 12);
      } catch {
        return { ok: false, message: 'INTERNAL_ERROR' };
      }

      try {
        const newUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
          },
          select: {
            id: true,
          },
        });

        if (newUser?.id) {
          return {
            ok: true,
            userId: newUser.id,
            email: normalizedEmail,
            accessibility: 'user',
            message: 'SIGNUP_SUCCESS',
          };
        }

        return { ok: false, message: 'INTERNAL_ERROR' };
      } catch {
        return { ok: false, message: 'INTERNAL_ERROR' };
      }
    }

    // ───────────────── LOGIN ─────────────────
    if (
      !existingUser?.id ||
      !existingUser?.passwordHash ||
      String(existingUser.passwordHash).length <= 0
    ) {
      return { ok: false, message: 'INVALID_CREDENTIALS' };
    }

    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, existingUser.passwordHash);
    } catch {
      return { ok: false, message: 'INTERNAL_ERROR' };
    }

    if (!passwordMatch) {
      return { ok: false, message: 'INVALID_CREDENTIALS' };
    }

    return {
      ok: true,
      userId: existingUser.id,
      email: normalizedEmail,
      accessibility: existingUser.accessibility,
      message: 'LOGIN_SUCCESS',
    };
  } catch {
    return { ok: false, message: 'INTERNAL_ERROR' };
  }
}
