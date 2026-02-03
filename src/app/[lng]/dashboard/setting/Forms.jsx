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
    (newPassword || confirmNewPassword) && !passwordsMatch;

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
    <div className='d-flex flex-column gap-3'>
      <h3>{t('dashboard.account.title')}</h3>
      <div className='row g-3'>
        <div className='col-md-6'>
          <div className='card p-3 d-flex flex-column gap-2 border-0 shadow rounded'>
            <h6>{t('dashboard.account.profile')}</h6>
            <form
              onSubmit={(e) => e.preventDefault()}
              className='d-flex flex-column gap-2'
            >
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <label className='form-label'>
                    {t('dashboard.account.email')}
                  </label>
                  <div
                    onClick={handleEmailVerify}
                    disabled={isSendingEmail}
                    className={`d-flex align-items-center btn badge ${
                      isSendingEmail ? 'disabled' : ''
                    } ${
                      data.emailVerified === null
                        ? 'd-none'
                        : data.emailVerified
                          ? 'btn-success'
                          : 'btn-danger animate__animated animate__pulse animate__infinite animate__slow'
                    } form-label`}
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
                <label className='form-label'>
                  {t('dashboard.account.username')}
                </label>

                <input
                  style={{ direction: 'ltr' }}
                  className={`form-control ${
                    data.username === null ? 'disabled' : ''
                  } ${
                    data.username !== null && !isValidUsername(data.username)
                      ? 'is-invalid'
                      : ''
                  }`}
                  type='text'
                  disabled={data.username === null}
                  value={data.username || ''}
                  onChange={handleUsernameChange}
                  autoComplete='new-username'
                />
                {usernameError ? (
                  <div className='invalid-feedback'>{usernameError}</div>
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
        <div className='col-md-6'>
          <div className='card p-3 d-flex flex-column gap-2 border-0 shadow rounded'>
            <h6>{t('dashboard.account.security')}</h6>
            <form
              onSubmit={(e) => e.preventDefault()}
              className='d-flex flex-column gap-2'
            >
              <div className='d-flex align-items-center gap-1'>
                <label className='form-label mb-0'>
                  {t('dashboard.account.oldPassword')}
                </label>
                <button
                  type='button'
                  className='btn btn-sm btn-link p-0 text-muted'
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  disabled={loading}
                  aria-label={
                    showOldPassword
                      ? t('dashboard.account.hide-password')
                      : t('dashboard.account.show-password')
                  }
                >
                  <i
                    className={`bi ${
                      showOldPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                  ></i>
                </button>
              </div>
              <input
                style={{ direction: 'ltr' }}
                type={showOldPassword ? 'text' : 'password'}
                className='form-control'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete='current-password'
              />
              <div className='d-flex align-items-center gap-1'>
                <label className='form-label mb-0'>
                  {t('dashboard.account.newPassword')}
                </label>
                <button
                  type='button'
                  className='btn btn-sm btn-link p-0 text-muted'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  aria-label={
                    showNewPassword
                      ? t('dashboard.account.hide-password')
                      : t('dashboard.account.show-password')
                  }
                >
                  <i
                    className={`bi ${
                      showNewPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                  ></i>
                </button>
              </div>
              <input
                style={{ direction: 'ltr' }}
                type={showNewPassword ? 'text' : 'password'}
                className={`form-control ${
                  showPasswordMismatchBorder ? 'border-danger' : ''
                }`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete='new-password'
              />
              <div className='d-flex align-items-center gap-1'>
                <label className='form-label mb-0'>
                  {t('dashboard.account.confirmNewPassword')}
                </label>
                <button
                  type='button'
                  className='btn btn-sm btn-link p-0 text-muted'
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
                    className={`bi ${
                      showConfirmNewPassword ? 'bi-eye-slash' : 'bi-eye'
                    }`}
                  ></i>
                </button>
              </div>
              <input
                style={{ direction: 'ltr' }}
                type={showConfirmNewPassword ? 'text' : 'password'}
                className={`form-control ${
                  showPasswordMismatchBorder ? 'border-danger' : ''
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
