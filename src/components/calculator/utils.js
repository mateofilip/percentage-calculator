export const formatNumber = (value) => {
  if (!Number.isFinite(value)) return String(value);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

export const createEmptyResult = () => ({ placeholder: true });

