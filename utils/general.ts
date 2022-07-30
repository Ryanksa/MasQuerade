export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
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
