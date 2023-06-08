const RESTORE_THRESHOLD = 0.1;

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
  size: number;
  colour: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  friction: number;
  ease: number;

  constructor(
    x: number,
    y: number,
    size: number,
    colour: string,
    friction: number,
    ease: number
  ) {
    this.size = size;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.friction = friction;
    this.ease = ease;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.vx = this.vx * this.friction + (this.originX - this.x) * this.ease;
    this.x += this.vx;
    this.vy = this.vy * this.friction + (this.originY - this.y) * this.ease;
    this.y += this.vy;
  }

  isRestored() {
    return (
      Math.abs(this.x - this.originX) < RESTORE_THRESHOLD &&
      Math.abs(this.y - this.originY) < RESTORE_THRESHOLD
    );
  }
}

export class ImageParticles {
  // Attributes
  image: HTMLImageElement;
  width: number;
  height: number;
  pixelSize: number;
  radius: number;
  friction: number;
  ease: number;
  // Particles
  particles: Particle[];
  // States
  mouseX: number;
  mouseY: number;
  hovering: boolean;
  restored: boolean;

  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    pixelSize: number,
    radius: number,
    friction: number,
    ease: number
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;
    this.radius = radius;
    this.friction = friction;
    this.ease = ease;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.hovering = false;
    this.restored = true;
  }

  init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    const pixels = ctx.getImageData(0, 0, this.width, this.height).data;
    for (let y = 0; y < this.height; y += this.pixelSize) {
      for (let x = 0; x < this.width; x += this.pixelSize) {
        const index = (y * this.width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const a = pixels[index + 3];
        const colour = `rgba(${r},${g},${b},${a})`;
        if (a > 0) {
          const particle = new Particle(
            x,
            y,
            this.pixelSize,
            colour,
            this.friction,
            this.ease
          );
          this.particles.push(particle);
        }
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      this.mouseX = event.clientX - canvasRect.left;
      this.mouseY = event.clientY - canvasRect.top;
    };
    const onMouseEnter = () => {
      this.hovering = true;
    };
    const onMouseLeave = () => {
      this.hovering = false;
      this.mouseX = -this.radius;
      this.mouseY = -this.radius;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    this.animate(ctx);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    let isRestored = true;
    ctx.clearRect(0, 0, this.width, this.height);
    for (const particle of this.particles) {
      particle.draw(ctx);
      isRestored = isRestored && particle.isRestored();
    }
    this.restored = isRestored;
  }

  update() {
    for (const particle of this.particles) {
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = dx ** 2 + dy ** 2;
      if (distance < this.radius ** 2) {
        const angle = Math.atan2(dy, dx);
        particle.vx = -this.radius * Math.cos(angle);
        particle.vy = -this.radius * Math.sin(angle);
      }
      particle.update();
    }
  }

  animate(ctx: CanvasRenderingContext2D) {
    const _animate = () => {
      if (this.hovering || !this.restored) {
        this.update();
        this.draw(ctx);
      }
      requestAnimationFrame(_animate);
    };
    requestAnimationFrame(_animate);
  }
}
