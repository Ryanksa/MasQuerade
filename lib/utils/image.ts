import { getRandomInt, getRandomArbitrary } from "./general";

const BYTE_RANGE = 255;

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, _reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = src;
  });
};

export class Particle {
  x: number;
  y: number;
  size: number;
  colour: string;

  constructor(x: number, y: number, size: number, colour: string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.colour = colour;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export class ImageParticles {
  // Attributes
  image: HTMLImageElement;
  width: number;
  height: number;
  pixelSize: number;
  alphaVariation: number;
  // Particles
  particles: Particle[];

  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    pixelSize: number,
    alphaVariation: number
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;
    this.alphaVariation = alphaVariation;
    this.particles = [];
  }

  init(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    const pixels = ctx.getImageData(0, 0, this.width, this.height).data;
    ctx.clearRect(0, 0, this.width, this.height);
    const sizeVariation = Math.round(this.pixelSize / 2);

    for (let y = 0; y < this.height; y += this.pixelSize) {
      for (let x = 0; x < this.width; x += this.pixelSize) {
        const index = (y * this.width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const a =
          pixels[index + 3] / BYTE_RANGE -
          getRandomArbitrary(0, this.alphaVariation);
        if (a <= 0) continue;

        const particle = new Particle(
          x,
          y,
          this.pixelSize + getRandomInt(-sizeVariation, sizeVariation),
          `rgba(${r},${g},${b},${a})`
        );
        this.particles.push(particle);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, particlesPerCycle: number) {
    const _animate = () => {
      const cycle = Math.min(particlesPerCycle, this.particles.length);
      for (let _ = 0; _ < cycle; _++) {
        const idx = getRandomInt(0, this.particles.length);
        this.particles[idx].draw(ctx);
        this.particles[idx] = this.particles.at(-1)!;
        this.particles.pop();
      }
      if (this.particles.length > 0) {
        requestAnimationFrame(_animate);
      }
    };
    requestAnimationFrame(_animate);
  }
}
