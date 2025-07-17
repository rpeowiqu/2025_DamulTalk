export const getFormattedDate = (date: string) => {
  const now = new Date(date);
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `${hours >= 12 ? "오후" : "오전"} ${(hours % 12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const getFormattedTime = (second: number) => {
  const min = Math.floor(second / 60)
    .toString()
    .padStart(2, "0");
  const sec = (second % 60).toString().padStart(2, "0");

  return `${min}:${sec}`;
};
