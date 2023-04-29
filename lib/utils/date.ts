const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const DAY_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const getToday = () => {
  const today = new Date();
  return {
    month: MONTHS[today.getMonth()],
    day: String(today.getDate()),
    day_of_week: DAY_OF_WEEK[today.getDay()],
  };
};
