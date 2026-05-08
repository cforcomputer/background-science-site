'use client';

import { useEffect, useRef } from 'react';
import { GeistSans } from 'geist/font/sans';
import styles from './glass-text.module.css';

interface Props {
  text: string;
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: number;
  scrollRef?: React.RefObject<HTMLElement | null>;
}

const VERT = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform sampler2D u_text;
uniform vec2 u_canvasPx;
uniform vec2 u_textPx;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_reduce;
uniform float u_scroll;

in vec2 v_uv;
out vec4 outColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), s.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), s.x),
    s.y
  );
}

// streak=0 → circular dot; streak=1 → long vertical line
float starLayer(vec2 aUv, float scale, float density, float seed, float parallax, float streak) {
  vec2 g = (aUv + vec2(0.0, u_scroll * parallax * 0.22)) * scale + seed;
  vec2 cell = floor(g);
  vec2 cellUv = fract(g) - 0.5;
  float h = hash21(cell);
  if (h >= density) return 0.0;

  vec2 starOff = (vec2(hash21(cell + 1.7), hash21(cell + 3.1)) - 0.5) * 0.6;
  vec2 delta = cellUv - starOff;

  float twinkle = mix(
    0.4 + 0.6 * abs(sin(u_time * (0.5 + h * 1.5) + h * 6.28)),
    0.85, u_reduce
  );
  twinkle = mix(twinkle, 1.0, streak);

  float dotSize = mix(0.06, 0.018, streak);
  float stretchY = 1.0 + streak * 32.0;
  float dist = length(vec2(delta.x * (1.0 + streak * 2.2), delta.y / stretchY));
  return smoothstep(dotSize, 0.0, dist) * twinkle;
}

vec3 computeStars(vec2 aUv, float streak) {
  vec3 c = vec3(0.0);
  c += vec3(1.00, 1.00, 1.00) * starLayer(aUv,  60.0, 0.040,  0.0, 1.0, streak);
  c += vec3(0.80, 0.90, 1.00) * starLayer(aUv, 100.0, 0.025, 17.3, 2.0, streak) * 0.6;
  c += vec3(1.00, 0.92, 0.85) * starLayer(aUv,  35.0, 0.060, 41.7, 0.5, streak) * 0.85;
  c += vec3(0.70, 0.85, 1.00) * starLayer(aUv, 150.0, 0.012, 91.1, 3.0, streak) * 0.45;
  return c;
}

vec3 iridescent(float t) {
  t = fract(t);
  vec3 pal[7];
  pal[0] = vec3(0.50, 0.86, 1.00);
  pal[1] = vec3(0.78, 0.97, 1.00);
  pal[2] = vec3(1.00, 0.96, 0.65);
  pal[3] = vec3(1.00, 0.69, 0.52);
  pal[4] = vec3(1.00, 0.55, 0.77);
  pal[5] = vec3(0.66, 0.55, 0.98);
  pal[6] = vec3(0.36, 0.42, 1.00);
  float s = t * 6.0;
  int idx = int(s);
  return mix(pal[idx], pal[min(idx + 1, 6)], fract(s));
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_canvasPx.x / max(u_canvasPx.y, 1.0);
  vec2 aUv = vec2(uv.x * aspect, uv.y);

  // streak ramps in from 55% scroll onward, quadratic ease
  float streak = smoothstep(0.55, 1.0, u_scroll);
  streak *= streak;

  // ── Background ──────────────────────────────────────────────────────────────
  vec3 col = mix(vec3(0.0), vec3(0.007, 0.005, 0.022), u_scroll);
  col += computeStars(aUv, streak);

  // Hyperspeed center glow
  if (streak > 0.005) {
    float r = length(uv - 0.5) * 2.0;
    col += vec3(0.04, 0.06, 0.38) * streak * exp(-r * 2.0);
    col += vec3(0.10, 0.04, 0.22) * streak * 0.28 * exp(-r * 0.65);
  }

  // ── Glass text ──────────────────────────────────────────────────────────────
  vec2 px     = uv * u_canvasPx;
  vec2 origin = (u_canvasPx - u_textPx) * 0.5;
  vec2 textUv = (px - origin) / u_textPx;
  textUv.y    = 1.0 - textUv.y;

  float tVal    = u_time * 0.4;
  float jellyStr = 0.005 + u_scroll * 0.006;

  vec2 jelly = (vec2(
    noise2D(uv * 5.0 + vec2(tVal, 0.0)),
    noise2D(uv * 5.0 + vec2(0.0, tVal) + 100.0)
  ) * 2.0 - 1.0) * jellyStr * (1.0 - u_reduce);

  vec2 toMouse = uv - u_mouse;
  toMouse.x *= aspect;
  vec2 mPush = -normalize(toMouse + 0.0001) * 0.045 * exp(-length(toMouse) * 7.0);
  mPush.x /= aspect;
  jelly += mPush * (1.0 - u_reduce);

  vec2 dUv = textUv + jelly;
  float ss = 0.005;

  if (dUv.x > -ss && dUv.x < 1.0 + ss && dUv.y > -ss && dUv.y < 1.0 + ss) {
    // Single clean mask — no RGB split on the text shape (that was the triple-ghost bug)
    float alpha = texture(u_text, clamp(dUv, 0.001, 0.999)).a;

    if (alpha > 0.005) {
      // Surface normal from alpha gradient (glass lens curvature)
      float nS = 0.003;
      float nx = texture(u_text, clamp(dUv + vec2(nS, 0.0), 0.0, 1.0)).a
               - texture(u_text, clamp(dUv - vec2(nS, 0.0), 0.0, 1.0)).a;
      float ny = texture(u_text, clamp(dUv + vec2(0.0, nS), 0.0, 1.0)).a
               - texture(u_text, clamp(dUv - vec2(0.0, nS), 0.0, 1.0)).a;
      float normalLen = length(vec2(nx, ny));

      float inside = smoothstep(0.3, 0.75, alpha);

      // Refract the background through the glass surface
      float refrStr = 0.025 + u_scroll * 0.010;
      // Chromatic aberration on the BACKGROUND (not the text shape — library-correct approach)
      float caStr = 0.007 + u_scroll * 0.003;
      vec2 rOff = vec2((uv.x + (nx + caStr) * refrStr) * aspect, uv.y + (ny + caStr) * refrStr);
      vec2 gOff = vec2((uv.x +  nx          * refrStr) * aspect, uv.y +  ny          * refrStr);
      vec2 bOff = vec2((uv.x + (nx - caStr) * refrStr) * aspect, uv.y + (ny - caStr) * refrStr);
      vec3 refractedBg = vec3(
        computeStars(rOff, streak).r,
        computeStars(gOff, streak).g,
        computeStars(bOff, streak).b
      );

      // Caustic shimmer inside glass body
      float caustic = noise2D(dUv * 9.0  + vec2(tVal * 0.7, 0.0))
                    * noise2D(dUv * 12.0 - vec2(0.0, tVal * 0.45));

      // Fresnel: peaks at letter edges where surface faces sideways
      float fresnel = normalLen * alpha;

      // Directional specular from surface normal (light from upper-left)
      float diffuse = clamp(nx * 0.65 + ny * 0.45, 0.0, 1.0);
      float spec    = pow(diffuse, 4.0) * inside;
      // Animated secondary sweep highlight
      float sweep   = smoothstep(0.45, 1.0, 0.5 + 0.5 * sin(dUv.x * 5.5 + u_time * 0.22 + 1.4))
                    * inside * (1.0 - u_reduce);
      float sparkle = smoothstep(0.92, 1.0, noise2D(dUv * 8.0 + tVal * 0.6)) * (1.0 - u_reduce);

      // Iridescent rim color (only used at the edge, not the body)
      vec3 ir = iridescent(fresnel * 1.8 + dUv.y * 0.25 + u_scroll * 0.4);

      vec3 glassCol = vec3(0.0);

      // Interior: refracted background + very faint frost glow to be visible against black
      glassCol += refractedBg;
      glassCol += vec3(0.07, 0.08, 0.12) * inside;           // ambient frost
      glassCol += caustic * ir * inside * 0.025;             // subtle caustic shimmer

      // Prismatic Fresnel rim (this is the glass edge, not a body fill)
      glassCol += ir * fresnel * 0.22;
      glassCol += vec3(0.85, 0.90, 1.0) * fresnel * 0.16;

      // Specular highlights
      glassCol += vec3(0.80, 0.88, 1.0) * (spec * 0.28 + sweep * 0.07 + sparkle * 0.18);

      // Scroll-reactive iridescent wash — extremely subtle
      glassCol += iridescent(u_scroll * 0.55 + 0.1) * inside * u_scroll * 0.06;

      // Occlusion: interior dims background slightly (frosted glass), edge is clean
      float occ = inside * 0.18 + fresnel * 0.06;
      col = col * (1.0 - occ) + glassCol * alpha;
    }
  }

  outColor = vec4(col, 1.0);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error('Shader compile: ' + log);
  }
  return s;
}

function buildProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error('Program link: ' + gl.getProgramInfoLog(p));
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return p;
}

function buildTextTexture(
  gl: WebGL2RenderingContext,
  lines: string[],
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  letterSpacing: number
): { tex: WebGLTexture; aspect: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const fontSpec = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = fontSpec;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;

  let maxW = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > maxW) maxW = w;
  }
  const padding    = fontSize * 0.18;
  const lineHeight = fontSize * 0.95;
  const cssW = Math.ceil(maxW + padding * 2);
  const cssH = Math.ceil(lineHeight * lines.length + padding * 2);

  canvas.width  = Math.max(2, cssW * dpr);
  canvas.height = Math.max(2, cssH * dpr);
  ctx.scale(dpr, dpr);
  ctx.font = fontSpec;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = 'white';

  const cx     = cssW / 2;
  const startY = padding + lineHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], cx, startY + i * lineHeight);
  }

  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return { tex, aspect: cssW / cssH };
}

const FONT_FAMILY = `${GeistSans.style.fontFamily}, -apple-system, BlinkMacSystemFont, sans-serif`;

export function GlassText({
  text,
  fontSize = 240,
  fontWeight = '500',
  letterSpacing = -8,
  scrollRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      try { await document.fonts.ready; } catch { /* proceed */ }
      if (cancelled) return;

      const gl = canvas.getContext('webgl2', {
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
      });
      if (!gl) { console.warn('WebGL2 not supported'); return; }

      try {
        const program = buildProgram(gl);
        gl.useProgram(program);

        const vbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uText   = gl.getUniformLocation(program, 'u_text');
        const uCanvas = gl.getUniformLocation(program, 'u_canvasPx');
        const uTextPx = gl.getUniformLocation(program, 'u_textPx');
        const uTime   = gl.getUniformLocation(program, 'u_time');
        const uMouse  = gl.getUniformLocation(program, 'u_mouse');
        const uReduce = gl.getUniformLocation(program, 'u_reduce');
        const uScroll = gl.getUniformLocation(program, 'u_scroll');

        const lines = text.split('\n');
        const txt   = buildTextTexture(gl, lines, fontSize, FONT_FAMILY, fontWeight, letterSpacing);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, txt.tex);
        gl.uniform1i(uText, 0);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gl.uniform1f(uReduce, reduceMotion ? 1 : 0);

        const mouse       = { x: 0.5, y: 0.5 };
        const mouseTarget = { x: 0.5, y: 0.5 };
        const onMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          mouseTarget.x = (e.clientX - rect.left) / rect.width;
          mouseTarget.y = 1.0 - (e.clientY - rect.top) / rect.height;
        };
        window.addEventListener('mousemove', onMouseMove);

        let textPx = { w: 1000, h: 200 };
        const resize = () => {
          const dpr  = Math.min(window.devicePixelRatio || 1, 2);
          const rect = canvas.getBoundingClientRect();
          canvas.width  = Math.max(2, Math.floor(rect.width  * dpr));
          canvas.height = Math.max(2, Math.floor(rect.height * dpr));
          gl.viewport(0, 0, canvas.width, canvas.height);
          const targetWcss = Math.min(rect.width * 0.86, 1200);
          const targetHcss = targetWcss / txt.aspect;
          textPx = { w: targetWcss * dpr, h: targetHcss * dpr };
        };
        resize();
        window.addEventListener('resize', resize);

        let visible = true;
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) visible = e.isIntersecting;
        });
        io.observe(canvas);

        const getScrollProgress = (): number => {
          const el = scrollRef?.current;
          if (!el) return 0;
          const rect = el.getBoundingClientRect();
          const totalH = el.offsetHeight - window.innerHeight;
          if (totalH <= 0) return 0;
          return Math.max(0, Math.min(1, -rect.top / totalH));
        };

        const start = performance.now();
        let raf = 0;
        const render = () => {
          mouse.x += (mouseTarget.x - mouse.x) * 0.08;
          mouse.y += (mouseTarget.y - mouse.y) * 0.08;

          if (visible) {
            const t = (performance.now() - start) / 1000;
            gl.uniform2f(uCanvas, canvas.width, canvas.height);
            gl.uniform2f(uTextPx, textPx.w, textPx.h);
            gl.uniform1f(uTime, t);
            gl.uniform2f(uMouse, mouse.x, mouse.y);
            gl.uniform1f(uScroll, getScrollProgress());

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          }
          raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('resize', resize);
          gl.deleteTexture(txt.tex);
          gl.deleteBuffer(vbo);
          gl.deleteProgram(program);
        };
      } catch (err) {
        console.error('GlassText init:', err);
      }
    };

    init();
    return () => { cancelled = true; cleanup?.(); };
  }, [text, fontSize, fontWeight, letterSpacing, scrollRef]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
