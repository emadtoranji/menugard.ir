'use client';

import { useState, useEffect, useRef } from 'react';
import { nextAuthLoginButtonHandler } from '@utils/auth/loginButtonHandler';
import { useT } from '@i18n/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { fallbackLng } from '@i18n/settings';
import {
  useGoogleReCaptcha,
  GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
import { validateStrongPassword } from '@utils/validateStrongPassword';
import { isValidQualityEmail } from '@utils/validationEmail';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import Spinner from '@components/Spinner';
import Image from 'next/image';

function SignInForm({ t, currentLang, enabledLoginProviders }) {
  const router = useRouter();
  const [signupRequired, setSignupRequired] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setIsValidEmail(isValidQualityEmail(email));
  }, [email]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    let captchaToken = 'localhost';
    if (process.env.NODE_ENV === 'production') {
      if (!executeRecaptcha) {
        toast.error(t('general.capcha-load-error'));
        return;
      }
      captchaToken = await executeRecaptcha('login_action');

      if (!captchaToken) {
        toast.error(t('general.capcha-load-error'));
        return;
      }
    }

    if (isSubmitting) return;

    try {
      if (!email || !isValidQualityEmail(email)) {
        toast.error(t('general.email-is-not-valid'));
        return;
      }

      if (signupRequired) {
        if (password !== passwordVerify) {
          toast.error(t('dashboard.login.passwords-do-not-match'));
          return;
        }
        const validatePassword = validateStrongPassword(password);
        if (!validatePassword.ok) {
          toast.error(
            t(
              `code-responses.${validatePassword.reason}`,
              t('code-responses.PASSWORD_NOT_STRONG'),
            ),
          );
          return;
        }
      }

      try {
        setIsSubmitting(true);
        setSubmitType('credentials');
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
          captcha: captchaToken,
          signup: signupRequired ? 1 : 0,
          password_verify: signupRequired ? passwordVerify : undefined,
          callbackUrl: `/${currentLang}/dashboard`,
        });
        if (result?.ok && result.ok === true && !result?.error) {
          toast.success(t('dashboard.login.login-success'));
          if (result?.url) {
            router.push(result.url);
          }
        } else {
          const params = new URLSearchParams(result.error);
          const message = params.get('message');
          if (message) {
            toast.error(t(`code-responses.${message}`, message));
          } else {
            const error = result?.error || 'UNKNOWN_ERROR';
            let errorMessage;
            if (error === 'Configuration') {
              errorMessage = t('code-responses.INTERNAL_ERROR');
            } else if (error === 'CredentialsSignin') {
              errorMessage = t('code-responses.INVALID_CREDENTIAL');
            } else if (error === 'TOO_MANY_REQUESTS') {
              errorMessage = t('code-responses.TOO_MANY_REQUESTS');
            } else {
              errorMessage = t(`code-responses.${error}`, error);
            }
            toast.error(errorMessage);
          }
        }
      } catch (e) {
        toast.error(t('general.unknown-problem'));
      }
      setIsSubmitting(false);
      setSubmitType('');
    } catch (e) {
      toast.error(t('general.unknown-problem'));
    }
  };

  return (
    <div className='p-6 shadow-lg bg-white rounded-2xl'>
      <div className='grid sm:flex sm:justify-between items-center mb-3 gap-2'>
        <h1 className='font-semibold'>{t('dashboard.login.title')}</h1>
        <button
          className='px-3 py-1 btn btn-sm btn-active'
          onClick={() => setSignupRequired(!signupRequired)}
        >
          {signupRequired
            ? t('dashboard.login.sign-in-button')
            : t('dashboard.login.sign-up-button')}
        </button>
      </div>

      <form onSubmit={handleSignIn} noValidate>
        <div className='relative mb-3'>
          <input
            id='email'
            name='email'
            style={{ textAlign: 'left', direction: 'ltr' }}
            type='email'
            className={`form-control ${isValidEmail ? 'is-valid' : 'is-invalid'}`}
            placeholder={t('dashboard.login.email-placeholder')}
            value={email}
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <label className='absolute right-3 top-2 text-muted' htmlFor='email'>
            {t('dashboard.login.email')}
          </label>
        </div>

        <div className='relative mb-3'>
          <input
            id='password'
            name='password'
            style={{ textAlign: 'left', direction: 'ltr' }}
            type='password'
            className={`form-control ${
              signupRequired && password !== passwordVerify
                ? 'is-invalid'
                : 'is-valid'
            }`}
            placeholder={t('dashboard.login.password-placeholder')}
            value={password}
            autoComplete={signupRequired ? 'new-password' : 'current-password'}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <label
            className='absolute right-3 top-2 text-muted'
            htmlFor='password'
          >
            {t('dashboard.login.password')}
          </label>
        </div>

        {signupRequired && (
          <div className='relative mb-3'>
            <input
              style={{ textAlign: 'left', direction: 'ltr' }}
              id='verify-password'
              name='verify-password'
              type='password'
              className={`form-control ${
                password !== passwordVerify ? 'is-invalid' : 'is-valid'
              }`}
              placeholder={t('dashboard.login.password-verify-placeholder')}
              value={passwordVerify}
              autoComplete='off'
              onChange={(e) => setPasswordVerify(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <label
              className='absolute right-3 top-2 text-muted'
              htmlFor='verify-password'
            >
              {t('dashboard.login.password-verify')}
            </label>
          </div>
        )}

        <div className='flex flex-col items-center justify-center gap-1 mx-auto'>
          <button
            className='w-full px-4 py-2 btn btn-lg btn-active text-white rounded mb-3 opacity-70 hover:font-semibold'
            type='submit'
            disabled={isSubmitting}
          >
            {submitType === 'credentials' ? (
              <Spinner color='text-white' />
            ) : signupRequired ? (
              t('dashboard.login.sign-up-button')
            ) : (
              t('dashboard.login.sign-in-button')
            )}
          </button>

          <div className='flex gap-6 mt-8 justify-center items-center'>
            {enabledLoginProviders.map((p, index) => {
              if (!p?.id) return undefined;
              if (p?.file) {
                return (
                  <Image
                    key={index}
                    alt={p.id}
                    width={25}
                    height={25}
                    src={`/images/auth-providers/dark/${p.file}`}
                    className={`w-10 h-10 ${p?.class || ''} opacity-70 hover:cursor-pointer`}
                    onClick={() => {
                      setSubmitType(p.id);
                      setIsSubmitting(true);
                      nextAuthLoginButtonHandler(
                        p.id,
                        `/${currentLang}/dashboard`,
                      );
                    }}
                    type='button'
                    disabled={isSubmitting}
                  />
                );
              }
              return (
                <button
                  key={index}
                  className={`px-3 py-2 w-36 h-36 rounded ${p?.class || ''} opacity-70`}
                  onClick={() => {
                    setSubmitType(p.id);
                    setIsSubmitting(true);
                    nextAuthLoginButtonHandler(
                      p.id,
                      `/${currentLang}/dashboard`,
                    );
                  }}
                  type='button'
                  disabled={isSubmitting}
                >
                  {submitType === p.id ? (
                    <Spinner color='text-white' />
                  ) : (
                    <span className='capitalize flex items-center gap-1'>
                      {p.id} <i className={`icon bi bi-${p.id}`}></i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Index({ enabledLoginProviders }) {
  const { t } = useT('dashboard');
  const { t: tNextAuth } = useT('next-auth');
  const lng = useParams()?.lng || fallbackLng;

  const googleSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || '';

  const searchParams = useSearchParams();

  const hasShownToast = useRef(false);

  useEffect(() => {
    const hasError = searchParams.get('error');
    if (!hasError) return;

    if (!hasShownToast.current) {
      hasShownToast.current = true;
      toast.error(tNextAuth(`error.${hasError}`, hasError));
    }
  }, [searchParams, tNextAuth]);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={googleSiteKey}
      language={lng}
      scriptProps={{ async: true, defer: true, appendTo: 'head' }}
    >
      <SignInForm
        t={t}
        currentLang={lng}
        enabledLoginProviders={enabledLoginProviders}
      />
    </GoogleReCaptchaProvider>
  );
}
