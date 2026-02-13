import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import type { OGLRenderingContext } from 'ogl';

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: 'forward' | 'reverse' | 'pingpong';
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

// Device capability detection
interface DeviceCapabilities {
  isLowPower: boolean;
  dpr: number;
  targetFps: number;
  frameInterval: number;
}

const getDeviceCapabilities = (): DeviceCapabilities => {
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = window.innerWidth <= 768;
  
  // Consider low-power if: mobile, low memory (<4GB), or few cores (<4)
  const isLowPower = isMobile || memory < 4 || cores < 4;
  
  return {
    isLowPower,
    dpr: isLowPower ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5),
    targetFps: isLowPower ? 30 : 60,
    frameInterval: isLowPower ? 1000 / 30 : 1000 / 60,
  };
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Full quality fragment shader
const fragmentHigh = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

// Lightweight fallback shader for low-power devices (fewer iterations, simpler math)
const fragmentLow = `#version 300 es
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 center = vec2(0.5);
  uv = (uv - center) / uScale + center;
  
  float T = iTime * uSpeed * uDirection;
  
  // Simplified plasma effect with fewer calculations
  float x = uv.x * 10.0;
  float y = uv.y * 10.0;
  
  float v1 = sin(x + T);
  float v2 = sin(y + T * 0.5);
  float v3 = sin(x + y + T * 0.3);
  float v4 = sin(sqrt(x*x + y*y) + T * 0.7);
  
  float v = (v1 + v2 + v3 + v4) * 0.25;
  
  vec3 col = vec3(
    sin(v * 3.14159 + T) * 0.5 + 0.5,
    sin(v * 3.14159 + T + 2.094) * 0.5 + 0.5,
    sin(v * 3.14159 + T + 4.188) * 0.5 + 0.5
  );
  
  float intensity = (col.r + col.g + col.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(col, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(col) * uOpacity * 0.5;
  fragColor = vec4(finalColor, alpha);
}`;

// Debounce utility
const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number): T => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as T;
};

export const Plasma: React.FC<PlasmaProps> = ({
  color = '#ffffff',
  speed = 1,
  direction = 'forward',
  scale = 1,
  opacity = 1,
  mouseInteractive = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Reusable refs to avoid allocations each frame
  const mousePos = useRef({ x: 0, y: 0 });
  const mousePending = useRef(false);
  const isVisible = useRef(false);
  const isPaused = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const capabilities = getDeviceCapabilities();
    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
    const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

    // Pre-allocate uniform arrays (reused every frame)
    const resolutionArray = new Float32Array([1, 1]);
    const mouseArray = new Float32Array([0, 0]);
    const colorArray = new Float32Array(customColorRgb);

    let renderer: Renderer | null = null;
    let gl: OGLRenderingContext | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let raf = 0;
    let lastFrameTime = 0;
    let t0 = 0;
    let initialized = false;

    const initWebGL = () => {
      if (initialized) return;
      initialized = true;

      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: capabilities.dpr
      });
      gl = renderer.gl;
      canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);

      const geometry = new Triangle(gl);

      // Use lightweight shader for low-power devices
      const fragmentShader = capabilities.isLowPower ? fragmentLow : fragmentHigh;

      program = new Program(gl, {
        vertex: vertex,
        fragment: fragmentShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: resolutionArray },
          uCustomColor: { value: colorArray },
          uUseCustomColor: { value: useCustomColor },
          uSpeed: { value: speed * 0.4 },
          uDirection: { value: directionMultiplier },
          uScale: { value: scale },
          uOpacity: { value: opacity },
          uMouse: { value: mouseArray },
          uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 }
        }
      });

      mesh = new Mesh(gl, { geometry, program });

      setSize();
      t0 = performance.now();
      startLoop();
    };

    const destroyWebGL = () => {
      if (!initialized) return;
      cancelAnimationFrame(raf);
      raf = 0;
      if (canvas && container.contains(canvas)) {
        try {
          container.removeChild(canvas);
        } catch { /* empty */ }
      }
      renderer = null;
      gl = null;
      canvas = null;
      program = null;
      mesh = null;
      initialized = false;
    };

    // Throttled mouse handler using rAF
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive || !program) return;
      const rect = container.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      
      // Throttle mouse updates to next animation frame
      if (!mousePending.current) {
        mousePending.current = true;
        requestAnimationFrame(() => {
          if (program) {
            mouseArray[0] = mousePos.current.x;
            mouseArray[1] = mousePos.current.y;
          }
          mousePending.current = false;
        });
      }
    };

    // Debounced resize handler
    const setSize = () => {
      if (!renderer || !gl || !program) return;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      // Reuse pre-allocated array
      resolutionArray[0] = gl.drawingBufferWidth;
      resolutionArray[1] = gl.drawingBufferHeight;
    };

    const debouncedSetSize = debounce(setSize, 100);

    const loop = (t: number) => {
      if (isPaused.current || !isVisible.current || !renderer || !program || !mesh) {
        raf = requestAnimationFrame(loop);
        return;
      }

      // Frame rate capping
      const elapsed = t - lastFrameTime;
      if (elapsed < capabilities.frameInterval) {
        raf = requestAnimationFrame(loop);
        return;
      }
      lastFrameTime = t - (elapsed % capabilities.frameInterval);

      const timeValue = (t - t0) * 0.001;
      
      if (direction === 'pingpong') {
        const pingpongDuration = 10;
        const segmentTime = timeValue % pingpongDuration;
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
        const u = segmentTime / pingpongDuration;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration;
        (program.uniforms.uDirection as { value: number }).value = 1.0;
        (program.uniforms.iTime as { value: number }).value = pingpongTime;
      } else {
        (program.uniforms.iTime as { value: number }).value = timeValue;
      }
      
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (raf) return;
      lastFrameTime = performance.now();
      raf = requestAnimationFrame(loop);
    };

    // Visibility change handler - pause when document hidden
    const handleVisibilityChange = () => {
      isPaused.current = document.hidden;
      if (!document.hidden && isVisible.current && initialized) {
        // Reset timing to avoid time jumps
        t0 = performance.now();
        lastFrameTime = performance.now();
      }
    };

    // IntersectionObserver - only render when visible
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible.current = entry.isIntersecting;
        
        if (entry.isIntersecting) {
          initWebGL();
        } else {
          // Optionally destroy WebGL when out of view to save memory
          // destroyWebGL();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(container);

    // ResizeObserver with debounced callback
    const ro = new ResizeObserver(debouncedSetSize);
    ro.observe(container);

    // Event listeners
    if (mouseInteractive) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mouseInteractive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      destroyWebGL();
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className="w-full h-full relative overflow-hidden" />;
};

export default Plasma;
