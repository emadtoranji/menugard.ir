'use client';
// Only For New and Edit/General Section

import { useEffect, useState } from 'react';
import Input from './Input';
import { useT } from '@i18n/client';
import Spinner from '@components/Spinner';
import { toBoolean } from '@utils/sanitizer';
import { numberToEnglish } from '@/src/utils/numbers';
import toast from 'react-hot-toast';
import { slugChars } from '@utils/isValidSlug';
import StoreValidationForm from '@utils/dashboard/store/validation';
import { useParams, useRouter } from 'next/navigation';
import { fallbackLng } from '@i18n/settings';

function CardWrapper({ children, hasError = false, label = '' }) {
  return (
    <div
      className={`card w-auto ${hasError ? 'is-invalid shadow-lg shadow-red-800' : ''}`}
    >
      <div className='card-title'>{label ?? ''}</div>
      <div className='card-body'>{children}</div>
    </div>
  );
}

export default function Form({
  isNewStore = true,
  oldStoreData = {},
  storeCategories,
  storeCurrencies,
}) {
  const lng = useParams()?.lng || fallbackLng;

  if (isNewStore) {
    oldStoreData = {};
  } else if (!oldStoreData?.id) {
    toast.error(t('general.unknown-problem'));
    router.push(`/${lng}/dashboard/my-store`);
  }

  const { t } = useT('dashboard-my-store');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/locations', { method: 'POST' });
        const resJson = await res.json();
        setLocations(Array.isArray(resJson?.result) ? resJson.result : []);
      } catch {
        toast.error(t('general.unknown-problem'));
      }
    })();
  }, [t]);

  const router = useRouter();

  const { t: tStoreCategories } = useT('store-categories');
  const [name, setName] = useState(oldStoreData?.name || '');
  const [description, setDescription] = useState(
    oldStoreData?.description || '',
  );
  const [slug, setSlug] = useState(oldStoreData?.slug || '');
  const [categories, setCategories] = useState(oldStoreData?.categories || []);

  const [country, setCountry] = useState(oldStoreData?.country || '');
  const [province, setProvince] = useState(oldStoreData?.province || '');
  const [provinces, setProvinces] = useState(undefined);
  const [address, setAddress] = useState(oldStoreData?.address || '');
  const [phone, setPhone] = useState(oldStoreData?.phone || '');
  const [currency, setCurrency] = useState(oldStoreData?.currency || '');
  const [tax, setTax] = useState({
    enable: oldStoreData?.taxEnabled || true,
    included: oldStoreData?.taxIncluded || true,
    percent: oldStoreData?.taxPercent || 10,
  });
  const [isStoreActive, setIsStoreActive] = useState(oldStoreData?.isActive);

  const [isBranchStore, setIsBranchStore] = useState(
    oldStoreData?.parentStoreId ? true : false,
  );
  const [headBranchStoreId, setHeadBranchStoreId] = useState(
    oldStoreData?.parentStoreId ? oldStoreData.parentStoreId : '',
  );
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [headStores, setHeadStores] = useState(null);
  const [submitIsAvailble, setSubmitIsAvailble] = useState(true);
  const [errors, setErrors] = useState({});

  function validateAllFields() {
    const newErrors = StoreValidationForm({
      name,
      description,
      slug,
      categories,
      country,
      province,
      address,
      phone,
      currency,
      tax,
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function HandleSubmit(e) {
    e.preventDefault();

    const isValid = validateAllFields();

    if (isValid) {
      const options = {
        isNewStore: isNewStore ? 1 : 0,
        id: isNewStore ? undefined : oldStoreData?.id,
        name,
        description,
        slug,
        categories,
        country,
        province,
        address,
        phone,
        currency,
        tax,
        isActive: isStoreActive,
        isBranchStore,
        headBranchStoreId: isBranchStore ? headBranchStoreId : undefined,
      };
      setIsSubmiting(true);

      try {
        const res = await fetch('/api/dashboard/store/store-general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options),
        });
        const result = await res.json();
        const storeId = result?.result?.id;

        if (result?.ok && storeId) {
          toast.success(
            t(
              isNewStore
                ? 'new.inserted-successfully'
                : 'edit.updated-successfully',
            ),
          );

          if (isNewStore) router.push(`/${lng}/dashboard/my-store`);
        } else {
          toast.error(
            t(
              `code-responses.${result?.message}`,
              result?.message || t('general.unknown-problem'),
            ),
          );
        }
        setIsSubmiting(false);
      } catch (err) {
        toast.error(t('general.unknown-problem'));
        setIsSubmiting(false);
      }
    } else {
      toast.error(t('code-responses.FORM_HAS_ERRORS'));
    }
  }

  function HandleChange(name, value) {
    if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value.replace(/[^\p{L}\p{N}\p{Emoji}\s]/gu, ''));
    } else if (name === 'slug') {
      setSlug(value.replace(new RegExp(`[^${slugChars}]`, 'gi'), ''));
    } else if (name === 'categories') {
      setCategories((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else if (name === 'country') {
      if (country !== value) {
        setProvince('');
      }
      setCountry(value);
    } else if (name === 'province') {
      setProvince(value);
    } else if (name === 'address') {
      setAddress(value);
    } else if (name === 'phone') {
      value = numberToEnglish(value);
      setPhone(value.replace(/[^0-9]/g, ''));
    } else if (name === 'currency') {
      setCurrency(value);
    } else if (name === 'tax-enabled') {
      setTax({ ...tax, enable: toBoolean(value) });
    } else if (name === 'tax-included') {
      setTax({ ...tax, included: toBoolean(value) });
    } else if (name === 'tax-percent') {
      value = numberToEnglish(value);
      setTax({ ...tax, percent: value.replace(/[^0-9]/g, '') });
    } else if (name === 'is-active') {
      setIsStoreActive(value);
    } else if (name === 'is-branch') {
      setIsBranchStore(toBoolean(value));
    } else if (name === 'head-store') {
      if (isBranchStore) setHeadBranchStoreId(value);
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  useEffect(() => {
    if (country) {
      setProvinces(locations.filter((f) => f?.countrySlug === country));
    } else {
      setProvinces(undefined);
      setProvince('');
    }
  }, [country, locations]);

  useEffect(() => {
    if (isBranchStore) {
      if (!headStores) {
        fetch('/api/dashboard/store/head-stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exceptId: isNewStore ? undefined : oldStoreData?.id,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res?.ok && Array.isArray(res?.result)) {
              setHeadStores(res.result);
            } else {
              toast.error(
                res?.message
                  ? t(`code-responses.${res.message}`, '') ||
                      t('general.unknown-problem')
                  : t('general.unknown-problem'),
              );
              setIsBranchStore(false);
              setHeadStores([]);
            }
          });
      } else {
        if (!headStores.length) {
          toast.error(t(`code-responses.NO_HEAD_STORE`));
          setIsBranchStore(false);
        }
      }
    }
  }, [t, isBranchStore, headStores, isNewStore, oldStoreData?.id]);

  const uniqueCountries = Array.from(
    new Map(locations.map((item) => [item.countrySlug, item])).values(),
  );

  return (
    <div className=''>
      <form
        noValidate
        onSubmit={HandleSubmit}
        className='w-full mt-7 mb-7 pb-7'
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <CardWrapper
            key='name'
            hasError={errors.name}
            label={t('key-names.name')}
          >
            <Input
              name='name'
              value={name}
              label={t('key-names.name')}
              HandleChange={HandleChange}
              disabled={false}
              isRtl={!/^[a-zA-Z]/.test(name)}
              hasValidValue={!errors.name}
            />
          </CardWrapper>
          <CardWrapper
            key='slug'
            hasError={errors.slug}
            label={t('key-names.slug')}
          >
            <Input
              name='slug'
              value={slug}
              HandleChange={HandleChange}
              label={t('key-names.slug')}
              disabled={false}
              hasValidValue={!errors.slug}
              isRtl={false}
            />
          </CardWrapper>
          <CardWrapper
            key='description'
            hasError={errors.description}
            label={t('key-names.description')}
          >
            <Input
              type='textarea'
              name='description'
              value={description}
              HandleChange={HandleChange}
              label={t('key-names.description')}
              disabled={false}
              hasValidValue={!errors.description}
              isRtl={!/^[a-zA-Z]/.test(description)}
            />
          </CardWrapper>
          <CardWrapper
            key='categories'
            hasError={errors.categories}
            label={t('key-names.categories')}
          >
            <div className='flex flex-wrap gap-2'>
              {storeCategories.map((itemValue) => (
                <button
                  type='button'
                  key={itemValue}
                  className={`btn btn-sm ${
                    categories.includes(itemValue)
                      ? 'btn-active font-bold'
                      : 'btn-inactive opacity-75'
                  }`}
                  onClick={() => HandleChange('categories', itemValue)}
                >
                  <span className='text-capitalize'>
                    {tStoreCategories(itemValue, itemValue)}
                  </span>
                </button>
              ))}
            </div>
          </CardWrapper>
          <CardWrapper
            key='countries'
            hasError={errors.country}
            label={t('key-names.country')}
          >
            <div className='my-3'>
              {!uniqueCountries.length ? (
                <Spinner small={true} categories='grow' center={false} />
              ) : undefined}
            </div>
            <div className='flex flex-wrap gap-2'>
              {!uniqueCountries.length
                ? undefined
                : uniqueCountries.map((item) => {
                    const slug = item.countrySlug;
                    const local = item.countryLocal;
                    return (
                      <button
                        type='button'
                        key={slug}
                        className={`btn btn-sm ${
                          country === slug
                            ? 'btn-active font-bold'
                            : 'btn-inactive opacity-75'
                        }`}
                        onClick={() => HandleChange('country', slug)}
                      >
                        <span className='text-uppercase'>{local}</span>
                      </button>
                    );
                  })}
            </div>
          </CardWrapper>
          {provinces && (
            <CardWrapper
              key='province'
              hasError={errors.province}
              label={t('key-names.province')}
            >
              <div className='flex flex-wrap gap-2'>
                {provinces.map((item) => {
                  const slug = item.provinceSlug;
                  const local = item.provinceLocal;
                  return (
                    <button
                      type='button'
                      key={slug}
                      className={`btn btn-sm ${
                        province === slug
                          ? 'btn-active font-bold'
                          : 'btn-inactive opacity-75'
                      }`}
                      onClick={() => HandleChange('province', slug)}
                    >
                      {local}
                    </button>
                  );
                })}
              </div>
            </CardWrapper>
          )}
          <CardWrapper
            key='address'
            hasError={errors.address}
            label={t('key-names.address')}
          >
            <Input
              name='address'
              value={address}
              HandleChange={HandleChange}
              label={t('key-names.address')}
              disabled={false}
              isRtl={!/^[a-zA-Z]/.test(address)}
              hasValidValue={!errors.address}
            />
          </CardWrapper>
          <CardWrapper
            key='phone'
            hasError={errors.phone}
            label={t('key-names.phone')}
          >
            <Input
              name='phone'
              value={phone}
              HandleChange={HandleChange}
              label={t('key-names.phone')}
              disabled={false}
              isRtl={false}
              hasValidValue={!errors.phone}
            />
          </CardWrapper>
          <CardWrapper
            key='currency'
            hasError={errors.currency}
            label={t('key-names.currency')}
          >
            <div className='flex flex-wrap gap-2'>
              {storeCurrencies.map((itemValue) => (
                <button
                  type='button'
                  key={itemValue}
                  className={`btn btn-sm ${
                    currency === itemValue
                      ? 'btn-active font-bold'
                      : 'btn-inactive opacity-75'
                  }`}
                  onClick={() => HandleChange('currency', itemValue)}
                >
                  <span className='currency-font text-uppercase'>
                    {t(`currencies.${itemValue}`, itemValue)}
                  </span>
                </button>
              ))}
            </div>
          </CardWrapper>
          <CardWrapper
            key='is-branch'
            hasError={errors.headBranchStoreId}
            label={t('key-names.is-branch')}
          >
            <div className='w-full'>
              <div className='grid gap-2'>
                <button
                  type='button'
                  className={`btn btn-sm ${
                    isBranchStore
                      ? 'btn-active font-bold'
                      : 'btn-inactive opacity-75'
                  }`}
                  onClick={() => HandleChange('is-branch', true)}
                >
                  {t('key-names.is-branch-yes')}
                </button>
                <button
                  type='button'
                  className={`btn btn-sm ${
                    !isBranchStore
                      ? 'btn-active font-bold'
                      : 'btn-inactive opacity-75'
                  }`}
                  onClick={() => HandleChange('is-branch', false)}
                >
                  {t('key-names.is-branch-no')}
                </button>
              </div>
            </div>
            <div className='mt-2'>
              {isBranchStore ? (
                Array.isArray(headStores) ? (
                  <div className='border-t border-stone-400 pt-3 mt-3'>
                    <h6 className='text-sm font-light mb-3'>
                      {t('key-names.is-branch-yes-select-head-store')}
                    </h6>
                    <div className='grid px-2 gap-2'>
                      {headStores.map((head) => {
                        return (
                          <button
                            key={`head-store-${head.id}`}
                            type='button'
                            className={`btn btn-sm w-fit ${head.id === headBranchStoreId ? 'btn-active' : 'btn-inactive'}`}
                            onClick={() => HandleChange('head-store', head.id)}
                          >
                            {head.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Spinner />
                )
              ) : undefined}
            </div>
          </CardWrapper>
          <CardWrapper key='tax-enabled' label={t('key-names.tax-enabled')}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <button
                type='button'
                className={`btn btn-sm ${
                  tax.enable
                    ? 'btn-active font-bold'
                    : 'btn-inactive opacity-75'
                }`}
                onClick={() => HandleChange('tax-enabled', true)}
              >
                {t('key-names.tax-enabled-yes')}
              </button>
              <button
                type='button'
                className={`btn btn-sm ${
                  !tax.enable
                    ? 'btn-active font-bold'
                    : 'btn-inactive opacity-75'
                }`}
                onClick={() => HandleChange('tax-enabled', false)}
              >
                {t('key-names.tax-enabled-no')}
              </button>
            </div>
          </CardWrapper>
          {tax.enable ? (
            <CardWrapper key='tax-included' label={t('key-names.tax-included')}>
              <div className='flex flex-col gap-2'>
                <button
                  type='button'
                  className={`btn btn-sm w-full ${
                    tax.included
                      ? 'btn-active font-bold'
                      : 'btn-inactive opacity-75'
                  }`}
                  onClick={() => HandleChange('tax-included', true)}
                >
                  {t('key-names.tax-included-yes')}
                </button>
                <button
                  type='button'
                  className={`btn btn-sm w-full ${
                    !tax.included
                      ? 'btn-active font-bold'
                      : 'btn-inactive opacity-75'
                  }`}
                  onClick={() => HandleChange('tax-included', false)}
                >
                  {t('key-names.tax-included-no')}
                </button>
              </div>

              <div className='w-full pt-5 mt-5 border-t border-stone-400'>
                <h6>{t('key-names.tax-percent')}</h6>
                <Input
                  name='tax-percent'
                  value={tax.percent}
                  HandleChange={HandleChange}
                  label={t('key-names.tax-percent')}
                  disabled={false}
                  isRtl={false}
                  hasValidValue={!errors['tax.percent']}
                />
              </div>
            </CardWrapper>
          ) : undefined}

          <CardWrapper key='is-store-active' label={t('key-names.is-active')}>
            <div className='flex flex-col gap-2'>
              <button
                type='button'
                className={`btn w-full ${
                  isStoreActive ? 'btn-active font-bold' : 'btn-inactive'
                }`}
                onClick={() => HandleChange('is-active', true)}
              >
                {t('key-names.is-active-yes')}
              </button>
              <button
                type='button'
                className={`btn w-full ${
                  !isStoreActive ? 'btn-danger font-bold' : 'btn-outline-danger'
                }`}
                onClick={() => HandleChange('is-active', false)}
              >
                {t('key-names.is-active-no')}
              </button>
            </div>
          </CardWrapper>
        </div>

        {/* submit */}
        <div className='mt-7'>
          <button
            type='submit'
            disabled={isSubmiting || !submitIsAvailble}
            className={`w-full btn btn-lg ${
              submitIsAvailble
                ? 'btn-success'
                : 'btn-outline-success opacity-75'
            }`}
          >
            {isSubmiting ? (
              <Spinner categories='grow' />
            ) : (
              t(isNewStore ? 'new.submit-button' : 'edit.update-button')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
