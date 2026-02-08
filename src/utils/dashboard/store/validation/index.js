import validateName from './name';
import validateDescription from './description';
import validateSlug from './slug';
import validateCategories from './categories';
import validateCountry from './country';
import validateProvince from './province';
import validateAddress from './address';
import validatePhone from './phone';
import validateCurrency from './currency';
import validateTax from './tax';
import validateHeadBranchStoreId from './headBranchStoreId';

export default function StoreValidationForm({
  name = undefined,
  description = undefined,
  slug = undefined,
  categories = undefined,
  locations = undefined,
  country = undefined,
  province = undefined,
  address = undefined,
  phone = undefined,
  currency = undefined,
  tax = undefined,
  isBranchStore = false,
  headBranchStoreId = undefined,
}) {
  let newErrors = {};

  // Name
  const __name = validateName(name);
  if (__name) newErrors.name = __name;

  // Description
  const __description = validateDescription(description);
  if (__description) newErrors.description = __description;

  // Slug
  const __slug = validateSlug(slug);
  if (__slug) newErrors.slug = __slug;

  // Type
  const __categories = validateCategories(categories);
  if (__categories) newErrors.categories = __categories;

  if (locations !== undefined) {
    // Country
    const __country = validateCountry(locations, country);
    if (__country) newErrors.country = __country;

    // Province
    const __province = validateProvince(locations, country, province);
    if (__province) newErrors.province = __province;
  }
  // Address
  const __address = validateAddress(address);
  if (__address) newErrors.address = __address;

  // Phone
  const __phone = validatePhone(phone);
  if (__phone) newErrors.phone = __phone;

  // Currency
  const __currency = validateCurrency(currency);
  if (__currency) newErrors.currency = __currency;

  // Tax
  const __tax = validateTax(tax);
  if (__tax) newErrors.tax = __tax;

  // isBranchStore
  if (isBranchStore) {
    const __headBranchStoreId = validateHeadBranchStoreId(headBranchStoreId);
    if (__headBranchStoreId) newErrors.headBranchStoreId = __headBranchStoreId;
  }

  return newErrors;
}
