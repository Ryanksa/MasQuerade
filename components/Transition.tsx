import { useState, useEffect } from "react";
import { transitionCallbacks } from "../hooks/router";
import styles from "../styles/Transition.module.css";

function Transition() {
  const [playTransition, setPlayTransition] = useState(false);

  useEffect(() => {
    transitionCallbacks.add(transition);
    return () => {
      transitionCallbacks.delete(transition);
    };
  }, []);

  const transition = () => {
    setPlayTransition(true);
  };

  return (
    <>
      {playTransition && (
        <div className="fixed left-0 top-0 w-screen h-screen overflow-hidden z-40">
          <div
            className={`
              absolute -left-[15%] -top-[15%] w-0 h-[120%] -skew-y-12 bg-black
              ${styles.bar1}
            `}
          />
          <div
            className={`
              absolute right-0 top-[90%] w-0 h-[60%] -skew-y-[24deg] bg-black
              ${styles.bar2}
            `}
          />
        </div>
      )}
      <svg>
        <filter id="bar-texture" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            id="bar-filter"
            numOctaves="1"
            baseFrequency="0.0009 0.015"
            stitchTiles="stitch"
          ></feTurbulence>
          <feDisplacementMap scale="120" in="SourceGraphic"></feDisplacementMap>
        </filter>
      </svg>
    </>
  );
}

export default Transition;
