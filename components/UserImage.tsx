import { useRef, useEffect } from "react";
import { ImageParticles, loadImage } from "../lib/utils/image";
import faUserSvg from "../assets/faUser.svg";
import { FaUser } from "react-icons/fa";

const PIXEL_SIZE = 9;
const ALPHA_VARIATION = 0.3;
const DRAW_CYCLE = 120;

function UserImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    let imageParticles: ImageParticles;
    (async function loadImageParticles() {
      const image = await loadImage(faUserSvg.src);

      const rect = container.getBoundingClientRect();
      canvas.height = rect.height;
      canvas.width = (rect.height / image.height) * image.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) return () => {};

      imageParticles = new ImageParticles(
        image,
        canvas.width,
        canvas.height,
        PIXEL_SIZE,
        ALPHA_VARIATION
      );
      imageParticles.init(ctx);
      imageParticles.draw(ctx, DRAW_CYCLE);
      imageParticles.startAnimating(ctx);
    })();

    return () => {
      imageParticles?.stopAnimating();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full aspect-square">
      <FaUser
        className="absolute left-0 top-0 w-full h-full text-neutral-50 -rotate-3"
        style={{ filter: "url('#turbulence')" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute -left-[5%] top-[10%] w-full h-[90%] -rotate-6"
        style={{ filter: "url('#turbulence')" }}
      />
      <svg>
        <defs>
          <filter id="turbulence">
            <feTurbulence
              numOctaves="6"
              baseFrequency="0.3 0.03"
            ></feTurbulence>
            <feDisplacementMap
              scale="30"
              in="SourceGraphic"
            ></feDisplacementMap>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default UserImage;
