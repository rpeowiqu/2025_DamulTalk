export const getQueryString = (params: Record<string, any>) => {
  return new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  ).toString();
};
