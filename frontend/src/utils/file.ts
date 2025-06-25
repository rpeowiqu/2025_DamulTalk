export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log2(bytes) / Math.log2(k));

  const size = bytes / Math.pow(k, i);
  const rounded = size.toFixed(0);

  return `${rounded} ${units[i]}`;
};
