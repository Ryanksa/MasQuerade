import { useEffect } from "react";
import { useSpring, useSpringRef } from "@react-spring/web";
import { ringNext } from "../utils/general";

export const useAnimatedMessage = (
  messagePolygons: { outer: string; inner: string }[],
  intervalTiming: number
) => {
  const api = useSpringRef();
  const animatedMessagePolygon = useSpring({
    ref: api,
    from: {
      outer: messagePolygons[0].outer,
      inner: messagePolygons[0].inner,
    },
  });

  useEffect(() => {
    let ringIdx = 0;
    const interval = setInterval(() => {
      ringIdx = ringNext(messagePolygons, ringIdx);
      api.start({
        to: {
          outer: messagePolygons[ringIdx].outer,
          inner: messagePolygons[ringIdx].inner,
        },
      });
    }, intervalTiming);

    return () => {
      clearInterval(interval);
    };
  }, [api, intervalTiming, messagePolygons]);

  return animatedMessagePolygon;
};
