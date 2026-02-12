'use client';

import { useMemo, useState } from 'react';
import { useT } from '@i18n/client';
import { isValidQualityEmail } from '@utils/validationEmail';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ResetForm({ hasAccess, currentLang = undefined }) {
  const router = useRouter();
  if (hasAccess) {
    //router.push(`/${currentLang}/dashboard`);
  }

  const { t } = useT('reset-password');
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isValidQualityEmail(email)) {
      toast.error(t(`code-responses.INVALID_INPUT`));
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          language: currentLang,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (data.ok) {
        toast.success(
          t(`code-responses.${data?.message}`, '') || 'Check Email',
        );
      } else {
        toast.error(
          t(`code-responses.${data?.message}`, '') ||
            t(`general.unknown-problem`),
        );
      }
    } catch {
      toast.error(t(`general.unknown-problem`));
    }
  };

  const emailValid = useMemo(() => {
    if (!email) return null;
    return isValidQualityEmail(email);
  }, [email]);

  return (
    <form onSubmit={handleReset} className='container'>
      <h1 className='mx-auto'>{t('form.title')}</h1>

      <h6 className='mt-5 px-1 text-primary'>{t('form.description')}</h6>

      <div className='relative mt-5'>
        <input
          id='email'
          name='email'
          style={{ direction: 'ltr', textAlign: 'left' }}
          type='email'
          value={email}
          className={`form-control ${
            emailValid === null
              ? 'is-unknown'
              : emailValid
                ? 'is-valid'
                : 'is-invalid'
          } w-full`}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t('form.email-placeholder')}
          autoComplete='off'
        />
        <label className='absolute right-3 top-2 text-muted' htmlFor='email'>
          {t('form.email-placeholder')}
        </label>
      </div>

      <div className='flex justify-center mt-3 w-full'>
        <button
          className={`btn btn-success px-3`}
          disabled={!emailValid}
          type='submit'
        >
          {t('form.button-title')}
        </button>
      </div>
    </form>
  );
}
