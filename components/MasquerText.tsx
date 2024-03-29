import { useMemo } from "react";
import styles from "../styles/MasquerText.module.css";
import { getRandomInt } from "../lib/utils/general";

const VARIATIONS = [
  styles.variation0,
  styles.variation1,
  styles.variation2,
  styles.variation3,
  styles.variation4,
  styles.variation5,
  styles.variation6,
  styles.variation7,
  styles.variation8,
  styles.variation9,
];

type MasquerChar = {
  char: string;
  class: string;
  flip: boolean;
  fontSize: number;
};

type Props = {
  text: string;
  flipIndices: number[];
  leftFontSize: number;
  fontStepSize: number;
  transform: string;
  transformOrigin: string;
  hoverInvert: boolean;
  transitionIn: boolean;
};

function MasquerText(props: Props) {
  const {
    text,
    flipIndices,
    leftFontSize,
    fontStepSize,
    transform,
    transformOrigin,
    hoverInvert,
    transitionIn,
  } = props;

  const chars: MasquerChar[] = useMemo(() => {
    const flipIndicesMap: { [index: number]: boolean } = {};
    for (const i of flipIndices) {
      flipIndicesMap[i] = true;
    }
    return text.split("").map((c, i) => ({
      char: c,
      class: VARIATIONS[getRandomInt(0, 10)],
      flip: !!flipIndicesMap[i],
      fontSize: leftFontSize + i * fontStepSize,
    }));
  }, [text, leftFontSize, fontStepSize]);

  return (
    <div
      className={`
        ${styles.container}
        ${hoverInvert ? styles.hoverinvert : ""}
        ${transitionIn ? styles.transitionin : ""}
      `}
      style={{
        transform: transform,
        transformOrigin: transformOrigin,
      }}
    >
      <div className="absolute">
        {chars.map((char, i) => (
          <span
            key={i}
            className={`
              inline-block
              ${styles.back} 
              ${char.class} 
              ${char.flip ? styles.flip : ""}
            `}
            style={{
              fontSize: char.fontSize,
              WebkitTextStrokeWidth: Math.floor(char.fontSize / 4),
            }}
          >
            {char.char}
          </span>
        ))}
      </div>
      {chars.map((char, i) => (
        <span
          key={i}
          className={`
            inline-block
            ${styles.fore} 
            ${char.class} 
            ${char.flip ? styles.flip : ""}
          `}
          style={{ fontSize: char.fontSize }}
        >
          {char.char}
        </span>
      ))}
    </div>
  );
}

export default MasquerText;
