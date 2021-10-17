const CHARS_PER_LINE = 30;

export const getNumberOfLines = (text: string): number => {
  const words = text.split(' ');
  let currLineChars = 0;
  let numLines = 1;
  for (let word of words) {
    if (currLineChars + word.length > CHARS_PER_LINE) {
      numLines++;
      if (word.length > CHARS_PER_LINE && currLineChars > 0) numLines++;
      currLineChars = word.length > CHARS_PER_LINE ? 0 : word.length + 1;
    } else {
      currLineChars += word.length + 1;
    }
  }
  return numLines;
};