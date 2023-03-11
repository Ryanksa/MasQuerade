import { useRef, useEffect } from "react";
import { getRandomArbitrary } from "../lib/utils/general";

function BaseLayout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawBackground();
    window.addEventListener("resize", drawBackground);
    return () => {
      window.removeEventListener("resize", drawBackground);
    };
  }, []);

  const drawBackground = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.fillStyle = "rgb(239 68 68)"; // red-500
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, getRandomArbitrary(height / 3, (2 * height) / 5));
    ctx.lineTo(getRandomArbitrary((7 * width) / 10, (8 * width) / 10), height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, getRandomArbitrary(height / 3, (2 * height) / 5));
    ctx.lineTo(getRandomArbitrary(width / 10, width / 5), 0);
    ctx.fill();
    ctx.restore();
  };

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-50"></canvas>;
}

export default BaseLayout;
