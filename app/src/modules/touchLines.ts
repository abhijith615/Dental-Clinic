import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

/**
 * WebGL "Touch the Lines" — a fine line-grid that organically bends and
 * emits a neon glow near the cursor, scaled by pointer velocity.
 * Drawn with screen blend over the section-1 video.
 */
export function initTouchLines(): void {
  const canvas = document.getElementById("linesCanvas") as HTMLCanvasElement;
  if (!canvas) return;

  const renderer = new Renderer({
    canvas,
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 2),
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const mouse = new Vec2(0.5, 0.5);
  const target = new Vec2(0.5, 0.5);
  let velocity = 0;
  let targetVel = 0;

  const vertex = /* glsl */ `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragment = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uVel;
    uniform vec2 uRes;

    // glow contribution of a single axis line-grid
    float grid(vec2 uv, float cells, float thickness) {
      vec2 g = abs(fract(uv * cells - 0.5) - 0.5) / fwidth(uv * cells);
      float line = min(g.x, g.y);
      return 1.0 - min(line * thickness, 1.0);
    }

    void main() {
      vec2 uv = vUv;
      float aspect = uRes.x / uRes.y;
      vec2 m = uMouse;

      // distance from cursor (aspect-corrected)
      vec2 d = uv - m;
      d.x *= aspect;
      float dist = length(d);

      // organic bend: push the grid toward the cursor, stronger with velocity
      float pull = exp(-dist * 6.0) * (0.04 + uVel * 0.18);
      vec2 warp = uv + normalize(d + 1e-4) * -pull;

      // animated drift so the field is never fully static
      warp += 0.004 * vec2(sin(uv.y * 8.0 + uTime), cos(uv.x * 8.0 + uTime * 0.8));

      float g = grid(warp, 22.0, 1.4);

      // neon proximity glow + velocity flare
      float glow = exp(-dist * 5.0) * (0.5 + uVel * 2.2);

      vec3 cold = vec3(0.61, 0.78, 0.88);   // glacier
      vec3 hot  = vec3(0.81, 0.91, 0.96);   // ice
      vec3 col = mix(cold, hot, glow);

      float alpha = g * (0.10 + glow * 0.9) + glow * 0.25;
      gl_FragColor = vec4(col * (0.6 + glow), alpha);
    }
  `;

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: mouse },
      uVel: { value: 0 },
      uRes: { value: new Vec2(1, 1) },
    },
    transparent: true,
  });

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    program.uniforms.uRes.value.set(r.width, r.height);
  }
  resize();
  window.addEventListener("resize", resize);

  // pointer tracking relative to the canvas
  let lastX = 0.5;
  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1.0 - (e.clientY - r.top) / r.height;
    target.set(x, y);
    targetVel = Math.min(Math.abs(x - lastX) * 14.0, 1.0);
    lastX = x;
  }
  window.addEventListener("mousemove", onMove);

  let raf = 0;
  function loop(t: number) {
    raf = requestAnimationFrame(loop);
    // ease pointer + velocity for fluidity
    mouse.x += (target.x - mouse.x) * 0.12;
    mouse.y += (target.y - mouse.y) * 0.12;
    targetVel *= 0.92;
    velocity += (targetVel - velocity) * 0.1;

    program.uniforms.uTime.value = t * 0.001;
    program.uniforms.uVel.value = velocity;
    renderer.render({ scene: mesh });
  }
  raf = requestAnimationFrame(loop);

  // pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(loop);
  });
}
