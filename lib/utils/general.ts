const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
};

export const incrementSocialStats = () => {
  return getRandomArbitrary(0, 3);
};

export const getNumberOfLines = (
  text: string,
  charsPerLine: number
): number => {
  const words = text.split(" ");
  let currLineChars = 0;
  let numLines = 1;
  for (let word of words) {
    if (currLineChars + word.length > charsPerLine) {
      numLines++;
      if (word.length > charsPerLine && currLineChars > 0) numLines++;
      currLineChars = word.length > charsPerLine ? 0 : word.length + 1;
    } else {
      currLineChars += word.length + 1;
    }
  }
  return numLines;
};

export const getToday = () => {
  const today = new Date();
  return {
    month: MONTHS[today.getMonth()],
    day: String(today.getDate()),
    day_of_week: DAY_OF_WEEK[today.getDay()],
  };
};
