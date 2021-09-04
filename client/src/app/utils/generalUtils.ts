export const getNumberOfLines = (text: string): number => {
  const words = text.split(' ');
  let word: string;
  let currLineChars = 0;
  let numLines = 1;
  for (word of words) {
    // a line can fit around 25 characters or so
    if (currLineChars + word.length > 25) {
      numLines++;
      if (word.length > 25 && currLineChars > 0) numLines++;
      currLineChars = word.length > 25 ? 0 : word.length + 1;
    } else {
      currLineChars += word.length + 1;
    }
  }
  return numLines;
};