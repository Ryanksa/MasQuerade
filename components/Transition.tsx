import { useState, useEffect } from "react";
import { transitionCallbacks } from "../hooks/router";
import { FaTheaterMasks } from "react-icons/fa";

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
        <div className="fixed right-0 bottom-0 p-3 z-40 animate-loadingSpin">
          <FaTheaterMasks size="3rem" color="#ffffff" />
        </div>
      )}
    </>
  );
}

export default Transition;
