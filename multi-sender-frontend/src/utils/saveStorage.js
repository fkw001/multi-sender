export const setLocalStorageHistory = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

export const getLocalStorageHistory = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {}
};
