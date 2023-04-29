import { useEffect } from "react";
import { useSpring, useSpringRef } from "@react-spring/web";
import { nextRingIndex } from "../utils/general";

export const useAnimatedMessage = (
  messagePolygons: { outer: string; inner: string }[],
  intervalTiming: number
) => {
  const api = useSpringRef();
  const animatedMessagePolygon = useSpring({
    ref: api,
    from: messagePolygons[0],
  });

  useEffect(() => {
    let ringIndex = 0;
    const interval = setInterval(() => {
      ringIndex = nextRingIndex(messagePolygons, ringIndex);
      api.start({ to: messagePolygons[ringIndex] });
    }, intervalTiming);

    return () => {
      clearInterval(interval);
    };
  }, [api, intervalTiming, messagePolygons]);

  return animatedMessagePolygon;
};
