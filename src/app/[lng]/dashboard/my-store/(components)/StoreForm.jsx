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
        {/* name + slug */}
        <div className='flex gap-3 pb-5 rounded'>
          <div className='w-full lg:w-1/2'>
            <Input
              name='name'
              value={name}
              HandleChange={HandleChange}
              label={t('key-names.name')}
              disabled={false}
              isRtl={!/^[a-zA-Z]/.test(name)}
              hasValidValue={!errors.name}
            />
          </div>
          <div className='w-full lg:w-1/2'>
            <Input
              name='slug'
              value={slug}
              HandleChange={HandleChange}
              label={t('key-names.slug')}
              disabled={false}
              hasValidValue={!errors.slug}
              isRtl={false}
            />
          </div>
        </div>

        {/* description */}
        <div className='pb-5 rounded'>
          <div className='w-full'>
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
          </div>
        </div>

        {/* categories */}
        <div
          className={` mt-1 py-3 ${errors.categories ? 'rounded is-invalid px-2' : 'border-t border-stone-400'}`}
        >
          <h6>{t('key-names.categories')}</h6>
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
        </div>

        {/* country */}
        <div
          className={`mt-1 py-3  ${errors.country ? 'rounded is-invalid px-2' : 'border-t border-stone-400'}`}
        >
          <h6>
            {t('key-names.country')}
            {!uniqueCountries.length ? (
              <Spinner small={true} categories='grow' center={false} />
            ) : undefined}
          </h6>
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
        </div>

        {/* province */}
        {provinces && (
          <div
            className={` mt-1 py-3  ${errors.province ? 'rounded is-invalid px-2' : 'border-t border-stone-400'}`}
          >
            <h6>{t('key-names.province')}</h6>
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
          </div>
        )}

        {/* address + phone */}
        <div className='grid gap-3 mt-1 py-3 border-t border-stone-400 rounded'>
          <div className='w-full lg:w-1/2'>
            <Input
              name='address'
              value={address}
              HandleChange={HandleChange}
              label={t('key-names.address')}
              disabled={false}
              isRtl={!/^[a-zA-Z]/.test(address)}
              hasValidValue={!errors.address}
            />
          </div>
          <div className='w-full lg:w-1/2'>
            <Input
              name='phone'
              value={phone}
              HandleChange={HandleChange}
              label={t('key-names.phone')}
              disabled={false}
              isRtl={false}
              hasValidValue={!errors.phone}
            />
          </div>
        </div>

        {/* currency */}
        <div
          className={` mt-1 py-3  ${errors.currency ? 'rounded is-invalid px-2' : 'border-t border-stone-400'}`}
        >
          <h6>{t('key-names.currency')}</h6>
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
        </div>

        {/* branch */}
        <div
          className={` mt-1 py-3  ${errors.headBranchStoreId ? 'rounded is-invalid px-2' : 'border-t border-stone-400'}`}
        >
          <div className='w-full'>
            <h6>{t('key-names.is-branch')}</h6>
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
                <div className='container grid grid-cols-auto gap-2'>
                  {headStores.map((head) => {
                    return (
                      <button
                        key={`head-store-${head.id}`}
                        type='button'
                        className={`btn btn-sm w-auto ${head.id === headBranchStoreId ? 'btn-active' : 'btn-inactive'}`}
                        onClick={() => HandleChange('head-store', head.id)}
                      >
                        {head.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Spinner />
              )
            ) : undefined}
          </div>
        </div>

        {/* tax */}
        <div className='mt-1 py-3 border-t border-stone-400 rounded'>
          <div className='w-full'>
            <h6>{t('key-names.tax-enabled')}</h6>
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
          </div>

          {tax.enable && (
            <>
              <div className='w-full lg:w-1/2'>
                <h6>{t('key-names.tax-included')}</h6>
                <div className='grid gap-2'>
                  <button
                    type='button'
                    className={`btn btn-sm ${
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
                    className={`btn btn-sm ${
                      !tax.included
                        ? 'btn-active font-bold'
                        : 'btn-inactive opacity-75'
                    }`}
                    onClick={() => HandleChange('tax-included', false)}
                  >
                    {t('key-names.tax-included-no')}
                  </button>
                </div>
              </div>

              <div className='w-full'>
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
            </>
          )}
        </div>

        <div className='mt-1 py-5 border-t border-stone-400 rounded'>
          <h6>{t('key-names.is-active')}</h6>
          <div className='flex gap-2'>
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
                !isStoreActive
                  ? 'btn-danger font-bold'
                  : 'border border-red-600'
              }`}
              onClick={() => HandleChange('is-active', false)}
            >
              {t('key-names.is-active-no')}
            </button>
          </div>
        </div>

        {/* submit */}
        <div className='mt-7'>
          <button
            type='submit'
            disabled={isSubmiting || !submitIsAvailble}
            className={`w-full btn btn-lg ${
              submitIsAvailble
                ? 'btn-success'
                : 'border border-green-600 opacity-75'
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
