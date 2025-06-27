export const getFormattedTime = () => {
  const now = new Date();
  const minutes = now.getMinutes();

  let hours = now.getHours();
  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }

  return `${hours >= 12 ? "오후" : "오전"} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
