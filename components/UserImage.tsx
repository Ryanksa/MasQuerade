import { useRef, useEffect } from "react";
import { ImageParticles, loadImage } from "../lib/utils/image";
import faUserSvg from "../assets/user.svg";
import { FaUser } from "react-icons/fa";

const PIXEL_SIZE = 9;
const RADIUS = 27;
const FRICTION = 0.9;
const EASE = 0.15;

function UserImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const loadImageParticles = async () => {
      const image = await loadImage(faUserSvg.src);

      const rect = container.getBoundingClientRect();
      canvas.height = rect.height;
      canvas.width = (rect.height / image.height) * image.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) return () => {};

      const imageParticles = new ImageParticles(
        image,
        canvas.width,
        canvas.height,
        PIXEL_SIZE,
        RADIUS,
        FRICTION,
        EASE
      );
      return imageParticles.init(canvas, ctx);
    };
    const cleanupPromise = loadImageParticles();

    return () => {
      cleanupPromise.then((cleanup) => cleanup());
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
