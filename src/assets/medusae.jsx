import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ cursorJitterRadius = 0.03, cursorJitterStrength = 1 }) => {
  const meshRef = useRef();
  const { viewport } = useThree();

  // User: "Add a bit more particles"
  const countX = 100;
  const countY = 55;
  const count = countX * countY;

  // Use a Plane for the pill shape. We will stretch it in the shader.
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    }),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            uniform float uTime;
            uniform vec2 uMouse;
            varying vec2 vUv;
            varying float vSize;
            varying vec2 vPos;
            
            attribute vec3 aOffset; 
            attribute float aRandom;
            // aAngleOffset removed/unused for alignment

            #define PI 3.14159265359

            // Simple noise for extra organic feel
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                
                return mix( mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            mat2 rotate2d(float _angle){
                return mat2(cos(_angle), sin(_angle),
                            -sin(_angle), cos(_angle));
            }

            void main() {
                vUv = uv;
                
                // --- 1. ALIVE FLOW (Base layer) ---
                vec3 pos = aOffset;
                
                // "Grid breaking" flow: Particles shouldn't stand still.
                // We apply a slow, continuous drift based on noise/sine fields.
                // This makes the whole field feel like a fluid medium (water/air).
                float driftSpeed = uTime * 0.15;
                
                // Curl-like flowing motion
                float dx = sin(driftSpeed + pos.y * 0.5) + sin(driftSpeed * 0.5 + pos.y * 2.0);
                float dy = cos(driftSpeed + pos.x * 0.5) + cos(driftSpeed * 0.5 + pos.x * 2.0);
                
                // subtle constant movement
                pos.x += dx * 0.25; 
                pos.y += dy * 0.25;

                // --- 2. THE JELLYFISH HALO (Smooth & Subtle) ---
                
                vec2 relToMouse = pos.xy - uMouse;
                float distFromMouse = length(relToMouse);
                float angleToMouse = atan(relToMouse.y, relToMouse.x);
                vec2 dirToMouse = normalize(relToMouse + vec2(0.0001, 0.0));
                
                // Organic Halo Shape
                // Very slow evolution of the noise (uTime * 0.1) to avoid "jumpy"
                float shapeFactor = noise(dirToMouse * 2.0 + vec2(0.0, uTime * 0.1));
                
                // Tunables
                float radiusBase = 2.2;
                float radiusAmplitude = 0.3;
                float shapeAmplitude = 0.5;
                float rimWidth = 1.8;
                float outerStartOffset = 0.2;
                float outerEndOffset = 2.2;
                float outerOscFrequency = 1.0;
                float outerOscAmplitude = 0.56;

                // The "Breathing" is now a slow expansion/contraction of the Halo Radius
                // nice and easy...
                float breathCycle = sin(uTime * 0.8); // Smooth -1 to 1
                
                // Radius breathes: base +/- amplitude
                float baseRadius = radiusBase + breathCycle * radiusAmplitude;
                float currentRadius = baseRadius + (shapeFactor * shapeAmplitude);
                
                // Interaction Ring Calculation
                float dist = distFromMouse; 
                float rimInfluence = smoothstep(rimWidth, 0.0, abs(dist - currentRadius));
                
                // --- 3. WAVE MOVEMENT (Gentle Ripple) ---
                // Instead of a fast travel wave, we just gently push particles out
                // when the Halo expands.
                
                vec2 pushDir = normalize(relToMouse + vec2(0.0001, 0.0));
                
                // Align push with the breath cycle
                // Increased push for "more alive" feeling
                float pushAmt = (breathCycle * 0.5 + 0.5) * 0.5; // 0 to 0.5
                
                // Apply push mostly near the ring
                pos.xy += pushDir * pushAmt * rimInfluence;
                
                // 3D: Subtle Z float
                pos.z += rimInfluence * 0.3 * sin(uTime);

                // --- 3.5 OUTER OSCILLATION (Smooth, Faster) ---
                // Faster motion outside the halo, but eased in smoothly.
                float outerInfluence = smoothstep(baseRadius + outerStartOffset, baseRadius + outerEndOffset, dist);
                float outerOsc = sin(uTime * outerOscFrequency + pos.x * 0.6 + pos.y * 0.6);
                pos.xy += normalize(relToMouse + vec2(0.0001, 0.0)) * outerOsc * outerOscAmplitude * outerInfluence;

                // --- 4. SIZE & SCALE ---
                
                // Base size fluctuates slightly with flow
                float baseSize = 0.012 + (sin(uTime + pos.x)*0.003);
                
                // Grow on ring
                // Smooth transition
                float activeSize = 0.055; 
                float currentScale = baseSize + (rimInfluence * activeSize);
                
                // Stretch (Minimal)
                float stretch = rimInfluence * 0.02;
                
                vec3 transformed = position;
                transformed.x *= (currentScale + stretch);
                transformed.y *= currentScale * 0.85; 
                
                vSize = rimInfluence;
                vPos = pos.xy;
                
                // --- 5. ROTATION ---
                
                // --- 5. ROTATION ---

                // User: "Must be directed towards mouse" (Radial)
                
                // Align with direction vector directly to avoid atan wrap jumps.
                float dirLen = max(length(relToMouse), 0.0001);
                vec2 dir = relToMouse / dirLen;
                float jitter = sin(uTime * 0.8 + pos.x * 0.35 + pos.y * 0.35) * 0.08;
                vec2 perp = vec2(-dir.y, dir.x);
                vec2 jitteredDir = normalize(dir + perp * jitter);
                mat2 rot = mat2(jitteredDir.x, jitteredDir.y, -jitteredDir.y, jitteredDir.x);
                transformed.xy = rot * transformed.xy;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + transformed, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            varying vec2 vUv;
            varying float vSize;
            varying vec2 vPos;

            void main() {
                // Shape: "Rectangle with radius"
                vec2 center = vec2(0.5);
                vec2 pos = abs(vUv - center) * 2.0; 
                
                float d = pow(pow(pos.x, 2.6) + pow(pos.y, 2.6), 1.0/2.6);
                float alpha = 1.0 - smoothstep(0.8, 1.0, d);
                
                if (alpha < 0.01) discard;

                // Google Brand Colors
                vec3 black = vec3(0.08, 0.08, 0.1);
                vec3 cBlue = vec3(0.26, 0.52, 0.96);
                vec3 cRed = vec3(0.92, 0.26, 0.21);
                vec3 cYellow = vec3(0.98, 0.73, 0.01);
                
                // --- Dynamic Color Shifting ---
                float t = uTime * 1.2; // FASTER color transition
                
                // Higher frequency (0.8) = smaller, more numerous color zones
                float p1 = sin(vPos.x * 0.8 + t);
                float p2 = sin(vPos.y * 0.8 + t * 0.8 + p1);
                
                // Mixed zones
                vec3 activeColor = mix(cBlue, cRed, p1 * 0.5 + 0.5);
                activeColor = mix(activeColor, cYellow, p2 * 0.5 + 0.5);
                
                // Mix with black for idle state
                vec3 finalColor = mix(black, activeColor, smoothstep(0.1, 0.8, vSize));
                float finalAlpha = alpha * mix(0.4, 0.95, vSize);

                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );

  useEffect(() => {
    if (!meshRef.current) return;

    // Populate attributes
    const offsets = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const angles = new Float32Array(count); // Random initial angles

    // Spread them out more since we reduced count
    const gridWidth = 40;
    const gridHeight = 22;
    const jitter = 0.25; // Subtle jitter - more grid-like but still organic

    let i = 0;
    for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
        // Normalized grid coords 0..1
        const u = x / (countX - 1);
        const v = y / (countY - 1);

        // Base grid position centered
        let px = (u - 0.5) * gridWidth;
        let py = (v - 0.5) * gridHeight;

        // Add NOISE to the grid
        px += (Math.random() - 0.5) * jitter;
        py += (Math.random() - 0.5) * jitter;

        offsets[i * 3] = px;
        offsets[i * 3 + 1] = py;
        offsets[i * 3 + 2] = 0;

        randoms[i] = Math.random();
        angles[i] = Math.random() * Math.PI * 2;
        i++;
      }
    }

    meshRef.current.geometry.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(offsets, 3),
    );
    meshRef.current.geometry.setAttribute(
      "aRandom",
      new THREE.InstancedBufferAttribute(randoms, 1),
    );
    meshRef.current.geometry.setAttribute(
      "aAngleOffset",
      new THREE.InstancedBufferAttribute(angles, 1),
    );
  }, [count, countX, countY]);

  // Track if mouse is on screen
  const hovering = useRef(true);

  useEffect(() => {
    const handleLeave = () => (hovering.current = false);
    const handleEnter = () => (hovering.current = true);

    document.body.addEventListener("mouseleave", handleLeave);
    document.body.addEventListener("mouseenter", handleEnter);

    return () => {
      document.body.removeEventListener("mouseleave", handleLeave);
      document.body.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  useFrame((state) => {
    const { clock, pointer } = state;
    material.uniforms.uTime.value = clock.getElapsedTime();

    // Determine Target
    let targetX = null;
    let targetY = null;

    // Only follow pointer if mouse is on screen
        if (hovering.current) {
            const baseX = (pointer.x * viewport.width) / 2;
            const baseY = (pointer.y * viewport.height) / 2;
            const t = clock.getElapsedTime();
            const jitterRadius = Math.min(viewport.width, viewport.height) * cursorJitterRadius;
            const jitterX = (Math.sin(t * 0.35) + Math.sin(t * 0.77 + 1.2)) * 0.5;
            const jitterY = (Math.cos(t * 0.31) + Math.sin(t * 0.63 + 2.4)) * 0.5;
            targetX = baseX + jitterX * jitterRadius * cursorJitterStrength;
            targetY = baseY + jitterY * jitterRadius * cursorJitterStrength;
        }

    // Current: Center of Gravity
    const current = material.uniforms.uMouse.value;

    // "Heavy" Drag: Reduced to 0.015 for more weight
    const dragFactor = 0.055;

    // If it's the very first frame or mouse just entered, we might want to snap
    // but for now, initializing to 0,0 already makes it appear instantly at center.
    if (targetX !== null && targetY !== null) {
      current.x += (targetX - current.x) * dragFactor;
      current.y += (targetY - current.y) * dragFactor;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

export default Particles;
