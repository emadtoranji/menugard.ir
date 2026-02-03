export function getLocalStorage(key) {
  return localStorage.getItem(key) ?? undefined;
}
export function setLocalStorage(key, value) {
  return localStorage.setItem(key, value);
}
