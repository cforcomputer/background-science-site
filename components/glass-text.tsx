'use client';

import { useEffect, useRef, useState } from 'react';
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
uniform vec2 u_texturePx;
uniform float u_thicknessPx;
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
  float activeDensity = min(0.085, density * (1.0 + streak * 0.72));
  if (h >= activeDensity) return 0.0;

  vec2 starOff = (vec2(hash21(cell + 1.7), hash21(cell + 3.1)) - 0.5) * 0.6;
  vec2 delta = cellUv - starOff;

  float twinkle = mix(
    0.4 + 0.6 * abs(sin(u_time * (0.5 + h * 1.5) + h * 6.28)),
    0.85, u_reduce
  );
  twinkle = mix(twinkle, 1.0, streak);

  float dotMask = smoothstep(0.055, 0.0, length(delta));
  float pulledY = delta.y - streak * 0.30;
  float trailLen = 0.08 + streak * 1.18;
  float core = exp(-pulledY * pulledY * 18.0);
  float halfWidth = mix(0.018, 0.034, streak) * (0.55 + core * 0.75);
  float xMask = smoothstep(halfWidth, 0.0, abs(delta.x));
  float yMask = smoothstep(trailLen, 0.0, abs(pulledY));
  float streakMask = xMask * yMask * (0.55 + core * 0.75);
  return mix(dotMask, streakMask, streak) * twinkle;
}

vec3 computeStars(vec2 aUv, float streak) {
  vec3 c = vec3(0.0);
  c += vec3(1.00, 1.00, 1.00) * starLayer(aUv,  60.0, 0.040,  0.0, 1.0, streak);
  c += vec3(0.80, 0.90, 1.00) * starLayer(aUv, 100.0, 0.025, 17.3, 2.0, streak) * 0.6;
  c += vec3(1.00, 0.92, 0.85) * starLayer(aUv,  35.0, 0.060, 41.7, 0.5, streak) * 0.85;
  c += vec3(0.70, 0.85, 1.00) * starLayer(aUv, 150.0, 0.012, 91.1, 3.0, streak) * 0.45;
  return c;
}

float computeStarField(vec2 aUv, float streak) {
  return dot(computeStars(aUv, streak), vec3(0.299, 0.587, 0.114));
}

vec3 sampleBackdrop(vec2 uv, float streak) {
  float aspect = u_canvasPx.x / max(u_canvasPx.y, 1.0);
  vec2 aUv = vec2(uv.x * aspect, uv.y);

  float warp = smoothstep(0.48, 1.0, u_scroll);
  float caShift = streak * (0.0038 + warp * 0.0062);
  vec2 aUvR = vec2(aUv.x, aUv.y - caShift);
  vec2 aUvB = vec2(aUv.x, aUv.y + caShift);

  vec3 bgBase = mix(vec3(0.0), vec3(0.006, 0.004, 0.018), min(u_scroll, 0.82));

  float starCore = computeStarField(aUv, streak);
  float redFringe = computeStarField(aUvR, streak);
  float blueFringe = computeStarField(aUvB, streak);
  vec3 splitStars = vec3(starCore) * (0.74 + warp * 0.18);
  splitStars += vec3(1.0, 0.12, 0.04) * redFringe * warp * 0.18;
  splitStars += vec3(0.08, 0.24, 1.0) * blueFringe * warp * 0.21;
  splitStars += vec3(0.56, 0.72, 1.0) * starCore * streak * 0.08;
  vec3 col = bgBase + splitStars;

  if (streak > 0.005) {
    float r = length(uv - 0.5) * 2.0;
    col += vec3(0.020, 0.024, 0.090) * streak * exp(-r * 2.0);
    col += vec3(0.055, 0.010, 0.045) * streak * warp * 0.12 * exp(-r * 0.8);
  }

  return col;
}

const vec3 LUMA_WEIGHTS = vec3(0.299, 0.587, 0.114);

vec3 applySaturation(vec3 color, float saturation) {
  float luminance = dot(color, LUMA_WEIGHTS);
  return clamp(mix(vec3(luminance), color, saturation), 0.0, 1.0);
}

vec4 applyGlassColor(vec4 liquidColor, vec4 glassColor) {
  float backdropLuminance = dot(liquidColor.rgb, LUMA_WEIGHTS);
  float glassLuminance = dot(glassColor.rgb, LUMA_WEIGHTS);
  vec3 tinted = clamp(glassColor.rgb + (backdropLuminance - glassLuminance), 0.0, 1.0);
  float chroma = max(max(glassColor.r, glassColor.g), glassColor.b)
               - min(min(glassColor.r, glassColor.g), glassColor.b);
  float chromaWeight = clamp(chroma * 8.0, 0.0, 1.0);
  vec3 directMix = mix(liquidColor.rgb, glassColor.rgb, glassColor.a);
  vec3 luminosityMix = mix(liquidColor.rgb, tinted, glassColor.a);
  return vec4(mix(directMix, luminosityMix, chromaWeight), liquidColor.a);
}

vec3 getHighlightColor(vec3 backgroundColor, float targetBrightness) {
  float luminance = dot(backgroundColor, LUMA_WEIGHTS);
  float maxComponent = max(max(backgroundColor.r, backgroundColor.g), backgroundColor.b);
  float lum = luminance * 2.5;
  float sat = maxComponent * 2.5;
  float colorInfluence = (lum / (1.0 + lum)) * (sat / (1.0 + sat));
  vec3 tinted = (backgroundColor / max(luminance, 0.001)) * targetBrightness;
  return mix(vec3(targetBrightness), tinted, colorInfluence);
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

float softLight(vec2 p, vec2 center, vec2 radius) {
  vec2 d = (p - center) / radius;
  return exp(-dot(d, d) * 1.55);
}

vec3 glassLightField(vec2 p, float t, float scroll) {
  float sweep = smoothstep(0.02, 0.98, scroll);
  vec2 q = p + vec2(0.38 - sweep * 0.76 + 0.018 * sin(t * 0.35), 0.035 * sin(scroll * 6.2831));
  vec3 c = vec3(0.0);
  c += vec3(0.10, 0.95, 0.62) * softLight(q, vec2(0.17 + 0.030 * sin(t * 0.71), 0.50), vec2(0.30, 0.56));
  c += vec3(1.00, 0.90, 0.22) * softLight(q, vec2(0.34 + 0.035 * cos(t * 0.58), 0.49), vec2(0.27, 0.52));
  c += vec3(1.00, 0.38, 0.14) * softLight(q, vec2(0.50 + 0.025 * sin(t * 0.63), 0.50), vec2(0.29, 0.54));
  c += vec3(1.00, 0.20, 0.56) * softLight(q, vec2(0.66 + 0.030 * cos(t * 0.67), 0.48), vec2(0.27, 0.52));
  c += vec3(0.18, 0.55, 1.00) * softLight(q, vec2(0.84 + 0.026 * sin(t * 0.52), 0.51), vec2(0.30, 0.56));
  return c;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_canvasPx.x / max(u_canvasPx.y, 1.0);

  // streak ramps in from 55% scroll onward, quadratic ease
  float streak = smoothstep(0.55, 1.0, u_scroll);
  streak *= streak;

  vec3 col = sampleBackdrop(uv, streak);

  // ── Glass text ──────────────────────────────────────────────────────────────
  vec2 px     = uv * u_canvasPx;
  // Vertically centered in viewport (y=0 is bottom in WebGL)
  vec2 origin = vec2((u_canvasPx.x - u_textPx.x) * 0.5, (u_canvasPx.y - u_textPx.y) * 0.5 + u_canvasPx.y * 0.045);
  vec2 textUv = (px - origin) / u_textPx;
  textUv.y    = 1.0 - textUv.y;

  float tVal     = u_time * 0.4;
  float jellyStr = 0.0035 + u_scroll * 0.005;

  vec2 jelly = (vec2(
    noise2D(uv * 5.0 + vec2(tVal, 0.0)),
    noise2D(uv * 5.0 + vec2(0.0, tVal) + 100.0)
  ) * 2.0 - 1.0) * jellyStr * (1.0 - u_reduce);

  vec2 toMouse = uv - u_mouse;
  toMouse.x *= aspect;
  vec2 mPush = -normalize(toMouse + 0.0001) * 0.032 * exp(-length(toMouse) * 7.0);
  mPush.x /= aspect;
  jelly += mPush * (1.0 - u_reduce);

  vec2 dUv = textUv + jelly;
  float ss = 0.005;

  if (dUv.x > -ss && dUv.x < 1.0 + ss && dUv.y > -ss && dUv.y < 1.0 + ss) {
    vec4 geometryData = texture(u_text, clamp(dUv, 0.001, 0.999));
    float alpha = geometryData.a;

    if (alpha > 0.005) {
      vec2 normalXY = geometryData.rg * 2.0 - 1.0;
      float normalZ = sqrt(max(0.0, 1.0 - dot(normalXY, normalXY)));
      vec3 normal = normalize(vec3(normalXY, normalZ));

      float displayScale = max(u_textPx.x / max(u_texturePx.x, 1.0), u_textPx.y / max(u_texturePx.y, 1.0));
      float thickness = max(1.0, u_thicknessPx * displayScale);
      float height = geometryData.b * thickness;

      vec3 baseRefract = refract(vec3(0.0, 0.0, -1.0), normal, 1.0 / 1.45);
      float refractLen = (height + thickness * 8.0) / max(0.001, abs(baseRefract.z));
      vec2 dispPx = baseRefract.xy * refractLen;
      dispPx.y = -dispPx.y;

      float chroma = 0.28 + u_scroll * 0.06;
      vec2 baseUv = dispPx / u_canvasPx;
      vec2 redUv = uv + baseUv * (1.0 + chroma);
      vec2 greenUv = uv + baseUv;
      vec2 blueUv = uv + baseUv * (1.0 - chroma);

      vec3 refractedBg = vec3(
        sampleBackdrop(redUv, streak).r,
        sampleBackdrop(greenUv, streak).g,
        sampleBackdrop(blueUv, streak).b
      );

      float normalizedHeight = geometryData.b;
      float thicknessScale = clamp(40.0 / max(thickness, 1.0), 1.0, 4.0);
      float edgeThreshold = mix(0.8, 0.5, 1.0 / thicknessScale);
      float edgeFactor = 1.0 - smoothstep(0.0, edgeThreshold, normalizedHeight);

      vec3 lightField = glassLightField(dUv, tVal, u_scroll);
      float reflectionMask = smoothstep(0.04, 0.92, alpha) * (0.72 + 0.28 * smoothstep(0.0, 0.85, normalizedHeight));
      refractedBg += lightField * reflectionMask * 0.30;

      vec4 glassColor = vec4(0.90, 0.96, 1.0, 0.13);
      vec4 finalColor = applyGlassColor(vec4(refractedBg, 1.0), glassColor);

      float backdropLuma = dot(refractedBg, LUMA_WEIGHTS);
      float adaptiveStrength = mix(1.2, 0.8, backdropLuma);
      finalColor.rgb = applySaturation(finalColor.rgb, 1.12 * adaptiveStrength);
      finalColor.rgb = mix(finalColor.rgb, glassColor.rgb, glassColor.a * 0.12 * (adaptiveStrength - 1.0));

      if (edgeFactor > 0.01) {
        vec2 lightDir = normalize(vec2(0.48, 0.82));
        vec2 anisoN = normalXY;
        float mainLight = max(0.0, dot(anisoN, lightDir));
        float oppositeLight = max(0.0, dot(anisoN, -lightDir));
        float totalInfluence = mainLight + oppositeLight * 0.8;
        float directional = totalInfluence * sqrt(totalInfluence) * 3.0;
        float ambient = 0.18;
        float brightRaw = (directional + ambient) * edgeFactor * thicknessScale * 0.78;
        float brightness = brightRaw / (1.0 + brightRaw);
        finalColor.rgb = mix(finalColor.rgb, getHighlightColor(refractedBg, 1.0), brightness);
      }

      float fresnel = (1.0 - normalZ) * edgeFactor * 0.10 * adaptiveStrength;
      finalColor.rgb = clamp(finalColor.rgb + vec3(fresnel), 0.0, 1.0);

      float caustic = noise2D(dUv * 10.0 + vec2(tVal * 0.25, -tVal * 0.18));
      float sparkle = smoothstep(0.965, 1.0, noise2D(dUv * 18.0 + tVal)) * (1.0 - u_reduce);
      finalColor.rgb += lightField * reflectionMask * 0.09;
      finalColor.rgb += iridescent(dUv.y * 0.22 + u_scroll * 0.28) * caustic * alpha * (1.0 - edgeFactor) * 0.012;
      finalColor.rgb += vec3(0.90, 0.96, 1.0) * sparkle * edgeFactor * 0.16;

      float occlusion = alpha * (0.030 + edgeFactor * 0.075);
      float glassAlpha = alpha * clamp(0.46 + edgeFactor * 0.42 + fresnel * 1.8, 0.34, 0.98);
      col = mix(col * (1.0 - occlusion), finalColor.rgb, glassAlpha);
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

const SDF_INF = 1e20;
const SDF_ALPHA_THRESHOLD = 24;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function edt1d(
  f: Float32Array,
  n: number,
  d: Float32Array,
  v: Int32Array,
  z: Float32Array
) {
  let k = -1;

  for (let q = 0; q < n; q++) {
    if (f[q] >= SDF_INF * 0.5) continue;

    if (k < 0) {
      k = 0;
      v[0] = q;
      z[0] = -SDF_INF;
      z[1] = SDF_INF;
      continue;
    }

    let s = 0;
    for (;;) {
      const r = v[k];
      s = ((f[q] + q * q) - (f[r] + r * r)) / (2 * (q - r));
      if (s > z[k]) break;
      k--;
      if (k < 0) break;
    }

    k++;
    v[k] = q;
    z[k] = k === 0 ? -SDF_INF : s;
    z[k + 1] = SDF_INF;
  }

  if (k < 0) {
    d.fill(SDF_INF, 0, n);
    return;
  }

  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    const delta = q - r;
    d[q] = delta * delta + f[r];
  }
}

function distanceTransform(
  mask: Uint8Array,
  width: number,
  height: number,
  targetValue: 0 | 1
): Float32Array {
  const temp = new Float32Array(width * height);
  const out = new Float32Array(width * height);
  const maxN = Math.max(width, height);
  const f = new Float32Array(maxN);
  const d = new Float32Array(maxN);
  const v = new Int32Array(maxN);
  const z = new Float32Array(maxN + 1);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      f[x] = mask[row + x] === targetValue ? 0 : SDF_INF;
    }
    edt1d(f, width, d, v, z);
    for (let x = 0; x < width; x++) temp[row + x] = d[x];
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      f[y] = temp[y * width + x];
    }
    edt1d(f, height, d, v, z);
    for (let y = 0; y < height; y++) out[y * width + x] = d[y];
  }

  return out;
}

function buildTextTexture(
  gl: WebGL2RenderingContext,
  lines: string[],
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  letterSpacing: number
): { tex: WebGLTexture; aspect: number; width: number; height: number; thicknessPx: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const fontSpec = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = fontSpec;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;

  // Measure each line's natural width
  const lineWidths = lines.map(l => ctx.measureText(l).width);
  const maxW = Math.max(...lineWidths, 1);

  const padding    = fontSize * 0.24;
  const lineHeight = fontSize * 0.95;

  // Uniform scale per line so every line fills maxW without distortion
  const lineScales    = lineWidths.map(w => (w > 0 ? maxW / w : 1.0));
  const scaledHeights = lineScales.map(s => lineHeight * s);
  const totalScaledH  = scaledHeights.reduce((a, b) => a + b, 0);

  const cssW = Math.ceil(maxW + padding * 2);
  const cssH = Math.ceil(totalScaledH + padding * 2);

  canvas.width  = Math.max(2, Math.ceil(cssW * dpr));
  canvas.height = Math.max(2, Math.ceil(cssH * dpr));
  ctx.scale(dpr, dpr);
  ctx.font = fontSpec;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = 'white';

  const cx = cssW / 2;
  let drawY = padding;
  for (let i = 0; i < lines.length; i++) {
    const s     = lineScales[i];
    const slotH = scaledHeights[i];
    const lineY = drawY + slotH / 2;
    ctx.save();
    ctx.translate(cx, lineY);
    ctx.scale(s, s);
    ctx.fillText(lines[i], 0, 0);
    ctx.restore();
    drawY += slotH;
  }

  const width = canvas.width;
  const height = canvas.height;
  const source = ctx.getImageData(0, 0, width, height);
  const mask = new Uint8Array(width * height);

  for (let i = 0; i < mask.length; i++) {
    mask[i] = source.data[i * 4 + 3] > SDF_ALPHA_THRESHOLD ? 1 : 0;
  }

  const distToOutside = distanceTransform(mask, width, height, 0);
  const distToInside = distanceTransform(mask, width, height, 1);
  const signedDistance = new Float32Array(width * height);

  for (let i = 0; i < signedDistance.length; i++) {
    signedDistance[i] = mask[i] ? -Math.sqrt(distToOutside[i]) : Math.sqrt(distToInside[i]);
  }

  const thicknessPx = Math.max(8, fontSize * dpr * 0.14);
  const geometry = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    const ym = Math.max(0, y - 1);
    const yp = Math.min(height - 1, y + 1);

    for (let x = 0; x < width; x++) {
      const xm = Math.max(0, x - 1);
      const xp = Math.min(width - 1, x + 1);
      const i = y * width + x;
      const sd = signedDistance[i];
      const out = i * 4;

      if (sd >= 0) {
        geometry[out + 0] = 128;
        geometry[out + 1] = 128;
        geometry[out + 2] = 0;
        geometry[out + 3] = 0;
        continue;
      }

      const foregroundAlpha = 1 - smoothstep(-2, 0, sd);
      if (foregroundAlpha < 0.004) {
        geometry[out + 0] = 128;
        geometry[out + 1] = 128;
        geometry[out + 2] = 0;
        geometry[out + 3] = 0;
        continue;
      }

      const dx = signedDistance[y * width + xp] - signedDistance[y * width + xm];
      const dy = signedDistance[yp * width + x] - signedDistance[ym * width + x];
      const nCos = Math.max(thicknessPx + sd, 0) / thicknessPx;
      const nSin = Math.sqrt(Math.max(0, 1 - nCos * nCos));

      let nx = dx * nCos;
      let ny = dy * nCos;
      let nz = nSin;
      const normalLen = Math.hypot(nx, ny, nz) || 1;
      nx /= normalLen;
      ny /= normalLen;
      nz /= normalLen;

      const xSection = Math.max(0, Math.min(thicknessPx, thicknessPx + sd));
      const sphericalHeight = Math.sqrt(Math.max(0, thicknessPx * thicknessPx - xSection * xSection));
      const heightValue = sd < -thicknessPx ? thicknessPx : sphericalHeight;

      geometry[out + 0] = Math.round(clamp01(nx * 0.5 + 0.5) * 255);
      geometry[out + 1] = Math.round(clamp01(ny * 0.5 + 0.5) * 255);
      geometry[out + 2] = Math.round(clamp01(heightValue / thicknessPx) * 255);
      geometry[out + 3] = Math.round(clamp01(foregroundAlpha) * 255);
    }
  }

  const geometryCanvas = document.createElement('canvas');
  geometryCanvas.width = width;
  geometryCanvas.height = height;
  const geometryCtx = geometryCanvas.getContext('2d')!;
  const geometryImage = geometryCtx.createImageData(width, height);
  geometryImage.data.set(geometry);
  geometryCtx.putImageData(geometryImage, 0, 0);

  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, geometryCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return { tex, aspect: cssW / cssH, width, height, thicknessPx };
}

const FONT_FAMILY = `${GeistSans.style.fontFamily}, -apple-system, BlinkMacSystemFont, sans-serif`;
const FONT_LOAD_TIMEOUT_MS = 350;

async function waitForDisplayFont(fontSize: number, fontWeight: string) {
  if (!('fonts' in document)) return;

  const primaryFamily = GeistSans.style.fontFamily.split(',')[0]?.trim() || 'sans-serif';

  try {
    await Promise.race([
      document.fonts.load(`${fontWeight} ${fontSize}px ${primaryFamily}`),
      new Promise((resolve) => window.setTimeout(resolve, FONT_LOAD_TIMEOUT_MS)),
    ]);
  } catch {
    // The fallback wordmark is already visible, so a font loading miss should not block WebGL.
  }
}

export function GlassText({
  text,
  fontSize = 240,
  fontWeight = '500',
  letterSpacing = -8,
  scrollRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    setCanvasReady(false);

    const init = async () => {
      await waitForDisplayFont(fontSize, fontWeight);
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
        const uTexturePx = gl.getUniformLocation(program, 'u_texturePx');
        const uThicknessPx = gl.getUniformLocation(program, 'u_thicknessPx');
        const uTime   = gl.getUniformLocation(program, 'u_time');
        const uMouse  = gl.getUniformLocation(program, 'u_mouse');
        const uReduce = gl.getUniformLocation(program, 'u_reduce');
        const uScroll = gl.getUniformLocation(program, 'u_scroll');

        const lines = text.split('\n');
        const txt   = buildTextTexture(gl, lines, fontSize, FONT_FAMILY, fontWeight, letterSpacing);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, txt.tex);
        gl.uniform1i(uText, 0);
        gl.uniform2f(uTexturePx, txt.width, txt.height);
        gl.uniform1f(uThicknessPx, txt.thicknessPx);

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
        let hasDrawn = false;
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

            if (!hasDrawn) {
              hasDrawn = true;
              setCanvasReady(true);
            }
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

  return (
    <div
      className={`${styles.stage} ${canvasReady ? styles.stageReady : ''}`}
      aria-hidden="true"
    >
      <div className={styles.loadingText}>Loading...</div>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
