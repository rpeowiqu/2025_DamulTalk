export const getQueryString = (params: Record<string, any>) => {
  return new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null),
  ).toString();
};
