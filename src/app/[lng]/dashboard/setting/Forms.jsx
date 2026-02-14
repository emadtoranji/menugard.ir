'use client';

import { useState, useLayoutEffect } from 'react';
import toast from 'react-hot-toast';
import { useT } from '@i18n/client';
import { validateStrongPassword } from '@utils/validateStrongPassword';
import { isValidUsername } from '@utils/validateUsername';
import { useRouter } from 'next/navigation';
import { toBoolean } from '@utils/sanitizer';
import Spinner from '@components/Spinner';

export default function Index({ user, currentLang }) {
  const { t } = useT('dashboard');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    emailVerified: null,
    username: null,
  });
  const [usernameError, setUsernameError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setNewConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const passwordsMatch =
    newPassword === confirmNewPassword || (!newPassword && !confirmNewPassword);
  const showPasswordMismatchBorder =
    !newPassword || !confirmNewPassword ? true : !passwordsMatch;

  useLayoutEffect(() => {
    if (user) {
      setData({
        email: user?.email || '',
        emailVerified: toBoolean(user?.emailVerified),
        username: user?.username || '',
      });
    }
  }, [user]);

  const validateUsername = (username, toastIt = true) => {
    if (!username) {
      return toastIt && toast.error(t('code-responses.USERNAME_MISSING'));
    }
    if (!isValidUsername(username)) {
      return toastIt && toast.error(t('code-responses.USERNAME_IS_NOT_VALID'));
    }
    return '';
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setData((d) => ({ ...d, username: newUsername }));
    setUsernameError(validateUsername(newUsername, false));
  };

  async function save() {
    const usernameValidationError = validateUsername(data.username, false);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      toast.error(t('dashboard.account.fixErrors'));

      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
        }),
      });

      const result = await res.json();
      if (result?.ok) {
        toast.success(
          t(
            `code-responses.${result?.message}`,
            t('dashboard.account.updated'),
          ),
        );
      } else {
        toast.error(
          t(
            `code-responses.${result?.message}`,
            result?.message || t('general.unknown-problem'),
          ),
        );
      }
    } catch (err) {
      toast.error(t('general.unknown-problem'));
    } finally {
      setLoading(false);
    }
  }

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  async function handleEmailVerify() {
    if (data.emailVerified || isSendingEmail) return;

    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/dashboard/send-verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: currentLang,
        }),
      });

      const result = await res.json();
      if (result?.ok) {
        toast.success(
          t(
            `code-responses.${result?.message}`,
            t('dashboard.account.passwordChanged'),
          ),
        );
      } else {
        toast.error(
          t(`code-responses.${result?.message}`, t('general.unknown-problem')),
        );
      }
      setIsSendingEmail(false);
    } catch (err) {
      setIsSendingEmail(false);
      toast.error(t('general.unknown-problem'));
    }
  }

  async function changePassword() {
    if (!oldPassword) {
      toast.error(t('code-responses.OLD_PASSWORD_IS_MISSING'));
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      toast.error(t('code-responses.NEW_PASSWORD_IS_MISSING'));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error(t('code-responses.PASSWORDS_DO_NOT_MATCH'));
      return;
    }
    const validatePassword = validateStrongPassword(newPassword);
    if (!validatePassword.ok) {
      toast.error(
        t(
          `code-responses.${validatePassword?.reason}`,
          t('code-responses.PASSWORD_NOT_STRONG', validatePassword.reason),
        ),
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_verify: confirmNewPassword,
        }),
      });

      const result = await res.json();
      if (result?.ok) {
        toast.success(
          t(
            `code-responses.${result?.message}`,
            t('dashboard.account.passwordChanged'),
          ),
          {
            duration: 3000,
          },
        );

        setTimeout(async function () {
          router.replace('/signout');
        }, 3000);
        setOldPassword('');
        setNewPassword('');
        setNewConfirmPassword('');
      } else {
        toast.error(
          t(`code-responses.${result?.message}`, t('general.unknown-problem')),
        );
      }
    } catch (err) {
      toast.error(t('general.unknown-problem') + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=''>
      <h2 className='font-bold mb-5'>{t('dashboard.account.title')}</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className=''>
          <div className='card p-3 flex flex-col gap-2'>
            <h4>{t('dashboard.account.profile')}</h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className='flex flex-col gap-2'
            >
              <div className='mb-1'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='form-label' htmlFor='email'>
                    {t('dashboard.account.email')}
                  </label>
                  <div
                    type='button'
                    onClick={handleEmailVerify}
                    disabled={isSendingEmail}
                    className={`flex items-center  ${
                      isSendingEmail ? 'disabled' : 'rounded btn btn-sm'
                    } ${
                      data.emailVerified === null
                        ? 'hidden'
                        : data.emailVerified
                          ? 'btn-success'
                          : 'btn-danger animate__animated animate__pulse animate__infinite animate__slow'
                    } form-label px-2 py-1`}
                  >
                    {isSendingEmail ? (
                      <Spinner small={true} />
                    ) : (
                      t(
                        `dashboard.account.email-${
                          data.emailVerified ? 'verified' : 'do-verify'
                        }`,
                      )
                    )}
                  </div>
                </div>
                <input
                  id='email'
                  style={{ direction: 'ltr' }}
                  className='form-control'
                  type='email'
                  value={data.email}
                  onChange={(e) =>
                    setData((d) => ({ ...d, email: e.target.value }))
                  }
                  readOnly
                  disabled
                  autoComplete='email'
                />
              </div>

              <div className='mb-1'>
                <label className='form-label' htmlFor='username'>
                  {t('dashboard.account.username')}
                </label>

                <input
                  id='username'
                  style={{ direction: 'ltr' }}
                  className={`form-control ${
                    data.username === null ? 'disabled' : ''
                  } ${
                    data.username !== null && !isValidUsername(data.username)
                      ? 'is-invalid'
                      : 'is-valid'
                  }`}
                  type='text'
                  disabled={data.username === null}
                  value={data.username || ''}
                  onChange={handleUsernameChange}
                  autoComplete='new-username'
                />
                {usernameError ? (
                  <div className='is-invalid'>{usernameError}</div>
                ) : undefined}
              </div>
              <button
                type='button'
                className='btn btn-primary'
                onClick={save}
                disabled={loading || !isValidUsername(data.username)}
              >
                {t('dashboard.account.save')}
              </button>
            </form>
          </div>
        </div>
        <div className=''>
          <div className='card p-3 flex flex-col gap-2'>
            <h4>{t('dashboard.account.security')}</h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className='flex flex-col gap-2'
            >
              <div className='flex items-center gap-1'>
                <label className='form-label mb-0' htmlFor='oldPassword'>
                  {t('dashboard.account.oldPassword')}
                </label>
                <button
                  type='button'
                  className='btn btn-sm p-0 text-gray-600'
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  disabled={loading}
                  aria-label={
                    showOldPassword
                      ? t('dashboard.account.hide-password')
                      : t('dashboard.account.show-password')
                  }
                >
                  <i
                    className={`text-lg bi ${
                      showOldPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                  ></i>
                </button>
              </div>
              <input
                id='oldPassword'
                style={{ direction: 'ltr' }}
                type={showOldPassword ? 'text' : 'password'}
                className='form-control'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete='current-password'
              />
              <div className='flex items-center gap-1'>
                <label className='form-label mb-0' htmlFor='newPassword'>
                  {t('dashboard.account.newPassword')}
                </label>
                <button
                  type='button'
                  className='btn btn-sm p-0 text-gray-600'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  aria-label={
                    showNewPassword
                      ? t('dashboard.account.hide-password')
                      : t('dashboard.account.show-password')
                  }
                >
                  <i
                    className={`text-lg bi ${
                      showNewPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                  ></i>
                </button>
              </div>
              <input
                id='newPassword'
                style={{ direction: 'ltr' }}
                type={showNewPassword ? 'text' : 'password'}
                className={`form-control ${
                  showPasswordMismatchBorder ? 'is-invalid' : 'is-valid'
                }`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete='new-password'
              />
              <div className='flex items-center gap-1'>
                <label className='form-label mb-0' htmlFor='confirmNewPassword'>
                  {t('dashboard.account.confirmNewPassword')}
                </label>
                <button
                  type='button'
                  className='btn btn-sm p-0 text-gray-600'
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmNewPassword
                      ? t('dashboard.account.hide-password')
                      : t('dashboard.account.show-password')
                  }
                >
                  <i
                    className={`text-lg bi ${
                      showConfirmNewPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                  ></i>
                </button>
              </div>
              <input
                id='confirmNewPassword'
                style={{ direction: 'ltr' }}
                type={showConfirmNewPassword ? 'text' : 'password'}
                className={`form-control ${
                  showPasswordMismatchBorder ? 'is-invalid' : 'is-valid'
                }`}
                value={confirmNewPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                autoComplete='new-password'
              />
              <button
                type='button'
                className='btn btn-warning'
                onClick={changePassword}
                disabled={
                  loading || !oldPassword || !newPassword || !confirmNewPassword
                }
              >
                {t('dashboard.account.changePassword')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
