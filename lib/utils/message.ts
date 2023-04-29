import { getRandomInt } from "./general";

const OUTER_POLYGON = [[350,40], [340,23], [330,30], [322,24], [325,0], [0,10], [0,35], [315,40], [318,45], [328,48], [341,36]]; // prettier-ignore
const INNER_POLYGON = [[350,40], [340,25], [330,33], [318,24], [320,5], [5,15], [9,30], [312,35], [315,40], [328,45], [341,35]]; // prettier-ignore
const REC_OUTER_POLYGON = [[5,55], [25,38], [35,42], [45,35], [48,5], [350,0], [340,40], [40,35], [43,55], [35,57], [25,52]]; // prettier-ignore
const REC_INNER_POLYGON = [[5,55], [25,40], [35,45], [50,35], [52,10], [340,5], [335,35], [47,30], [48,50], [35,55], [25,50]]; // prettier-ignore
// Indices of the polygon that need to be adjusted by the message's height
const HEIGHT_INDICES = [6, 7];

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

export const getMessagePolygon = (
  received: boolean,
  height: number,
  xNoise: number,
  yNoise: number
): { outer: string; inner: string } => {
  const outerPolygon = received ? REC_OUTER_POLYGON : OUTER_POLYGON;
  const innerPolygon = received ? REC_INNER_POLYGON : INNER_POLYGON;
  // Map polygon points to path string with noise
  const reducer = (str: string, point: number[], index: number) => {
    const x = point[0] - xNoise / 2 + getRandomInt(0, xNoise);
    const y = point[1] - yNoise / 2 + getRandomInt(0, yNoise);
    return str + `${x},${y + (HEIGHT_INDICES.includes(index) ? height : 0)} `;
  };
  return {
    outer: outerPolygon.reduce(reducer, ""),
    inner: innerPolygon.reduce(reducer, ""),
  };
};
