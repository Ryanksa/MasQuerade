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
              absolute left-0 bottom-0 w-0 h-[120%] -skew-y-[15deg]
              ${styles.bar} ${styles.bar1}
            `}
          />
          <div
            className={`
              absolute right-0 -bottom-[30vh] w-0 h-[45%] -skew-y-[9deg] 
              ${styles.bar} ${styles.bar2}
            `}
          />
          <div
            className={`
              absolute left-0 -top-[30vh] w-0 h-[45%] -skew-y-[15deg] 
              ${styles.bar} ${styles.bar3}
            `}
          />
        </div>
      )}
      <svg>
        <filter id="bar-texture" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            id="bar-filter"
            numOctaves="1"
            baseFrequency="0 0.03"
          ></feTurbulence>
          <feDisplacementMap scale="60" in="SourceGraphic"></feDisplacementMap>
          <animate
            xlinkHref="#bar-filter"
            attributeName="baseFrequency"
            dur="0.45s"
            keyTimes="0;0.5;1"
            values="0 0.03;0 0.018;0 0.03"
            repeatCount="1"
          />
        </filter>
      </svg>
    </>
  );
}

export default Transition;
