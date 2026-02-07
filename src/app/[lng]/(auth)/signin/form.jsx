'use client';

import { useState, useEffect, useRef } from 'react';
import { nextAuthLoginButtonHandler } from '@utils/auth/loginButtonHandler';
import { useT } from '@i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

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
    <section className='container-fluid main-vh-100 d-flex align-items-center justify-content-center'>
      <div className='form-signin p-4 shadow-lg bg-white rounded-4 col-12 col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4'>
        <div className='d-flex justify-content-between align-items-center mb-3 gap-2'>
          <h1 className='h3 lead fw-semibold'>{t('dashboard.login.title')}</h1>
          <button
            className='btn btn-inactive btn-sm fw-bold'
            onClick={() => setSignupRequired(!signupRequired)}
          >
            {signupRequired
              ? t('dashboard.login.sign-in-button')
              : t('dashboard.login.sign-up-button')}
          </button>
        </div>
        <form onSubmit={handleSignIn} noValidate>
          <div className='form-floating mb-3'>
            <input
              name='email'
              style={{ textAlign: 'left', direction: 'ltr' }}
              type='email'
              className='form-control'
              placeholder={t('dashboard.login.email-placeholder')}
              value={email}
              autoComplete='email'
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <label className='end-0'>{t('dashboard.login.email')}</label>
          </div>

          <div className='form-floating mb-3'>
            <input
              name='password'
              style={{ textAlign: 'left', direction: 'ltr' }}
              type='password'
              className={`form-control ${
                signupRequired && password !== passwordVerify
                  ? 'border-danger'
                  : ''
              }`}
              placeholder={t('dashboard.login.password-placeholder')}
              value={password}
              autoComplete={
                signupRequired ? 'new-password' : 'current-password'
              }
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <label className='end-0'>{t('dashboard.login.password')}</label>
          </div>

          {signupRequired && (
            <div className='form-floating mb-3'>
              <input
                style={{ textAlign: 'left', direction: 'ltr' }}
                name='verify-password'
                type='password'
                className={`form-control ${
                  password !== passwordVerify ? 'border-danger' : ''
                }`}
                placeholder={t('dashboard.login.password-verify-placeholder')}
                value={passwordVerify}
                autoComplete='off'
                onChange={(e) => setPasswordVerify(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <label className='end-0'>
                {t('dashboard.login.password-verify')}
              </label>
            </div>
          )}

          <div className='row d-flex align-items-center justify-content-center g-1'>
            <button
              className='btn btn-active mb-3'
              type='submit'
              disabled={isSubmitting}
            >
              {submitType === 'credentials' ? (
                <Spinner small={true} />
              ) : signupRequired ? (
                t('dashboard.login.sign-up-button')
              ) : (
                t('dashboard.login.sign-in-button')
              )}
            </button>

            <div className='row row-cols-4 gap-2 justify-content-center mt-4'>
              {enabledLoginProviders.map((p, index) => {
                if (!p?.id) {
                  return undefined;
                }
                if (p?.file) {
                  return (
                    <Image
                      key={index}
                      alt={p.id}
                      width={60}
                      height={60}
                      src={`/images/auth-providers/dark/${p.file}`}
                      className={`w-auto ${p?.class || ''} ${
                        isSubmitting ? 'opacity-75' : ''
                      }`}
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
                    className={`btn ${p?.class || ''}`}
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
                      <Spinner small={true} />
                    ) : (
                      <span className='text-capitalize'>
                        {p.id} <i className={`bi bi-${p.id}`}></i>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function Index({ enabledLoginProviders }) {
  const { t, i18n } = useT('dashboard');
  const { t: tNextAuth } = useT('next-auth');
  const currentLang = i18n?.language || fallbackLng;

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
      language={currentLang}
      scriptProps={{ async: true, defer: true, appendTo: 'head' }}
    >
      <SignInForm
        t={t}
        currentLang={currentLang}
        enabledLoginProviders={enabledLoginProviders}
      />
    </GoogleReCaptchaProvider>
  );
}
