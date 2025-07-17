export const getFormattedDate = (date: string) => {
  const now = new Date(date);
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `${hours >= 12 ? "오후" : "오전"} ${(hours % 12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
