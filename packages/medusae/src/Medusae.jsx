/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "./medusae.css";

const DEFAULTS = {
  cursor: {
    radius: 0.065,
    strength: 2,
    dragFactor: 0.015,
  },
  halo: {
    outerOscFrequency: 2.6,
    outerOscAmplitude: 0.76,
    radiusBase: 2.2,
    radiusAmplitude: 0.5,
    shapeAmplitude: 0.75,
    rimWidth: 1.8,
    outerStartOffset: 0.4,
    outerEndOffset: 2.2,
  },
  particles: {
    baseSize: 0.012,
    activeSize: 0.055,
    blobScaleX: 1.0,
    blobScaleY: 0.75,
  },
};

const mergeConfig = (config) => ({
  cursor: { ...DEFAULTS.cursor, ...(config?.cursor ?? {}) },
  halo: { ...DEFAULTS.halo, ...(config?.halo ?? {}) },
  particles: { ...DEFAULTS.particles, ...(config?.particles ?? {}) },
});

const Particles = ({ config }) => {
  const meshRef = useRef();
  const { viewport } = useThree();
  const merged = useMemo(() => mergeConfig(config), [config]);

  const countX = 100;
  const countY = 55;
  const count = countX * countY;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uOuterOscFrequency: { value: DEFAULTS.halo.outerOscFrequency },
      uOuterOscAmplitude: { value: DEFAULTS.halo.outerOscAmplitude },
      uHaloRadiusBase: { value: DEFAULTS.halo.radiusBase },
      uHaloRadiusAmplitude: { value: DEFAULTS.halo.radiusAmplitude },
      uHaloShapeAmplitude: { value: DEFAULTS.halo.shapeAmplitude },
      uHaloRimWidth: { value: DEFAULTS.halo.rimWidth },
      uHaloOuterStartOffset: { value: DEFAULTS.halo.outerStartOffset },
      uHaloOuterEndOffset: { value: DEFAULTS.halo.outerEndOffset },
      uParticleBaseSize: { value: DEFAULTS.particles.baseSize },
      uParticleActiveSize: { value: DEFAULTS.particles.activeSize },
      uBlobScaleX: { value: DEFAULTS.particles.blobScaleX },
      uBlobScaleY: { value: DEFAULTS.particles.blobScaleY },
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
            uniform float uOuterOscFrequency;
            uniform float uOuterOscAmplitude;
            uniform float uHaloRadiusBase;
            uniform float uHaloRadiusAmplitude;
            uniform float uHaloShapeAmplitude;
            uniform float uHaloRimWidth;
            uniform float uHaloOuterStartOffset;
            uniform float uHaloOuterEndOffset;
            uniform float uParticleBaseSize;
            uniform float uParticleActiveSize;
            uniform float uBlobScaleX;
            uniform float uBlobScaleY;
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
                
                float driftSpeed = uTime * 0.15;
                
                float dx = sin(driftSpeed + pos.y * 0.5) + sin(driftSpeed * 0.5 + pos.y * 2.0);
                float dy = cos(driftSpeed + pos.x * 0.5) + cos(driftSpeed * 0.5 + pos.x * 2.0);
                
                pos.x += dx * 0.25; 
                pos.y += dy * 0.25;

                // --- 2. THE JELLYFISH HALO (Smooth & Subtle) ---
                
                vec2 relToMouse = pos.xy - uMouse;
                float distFromMouse = length(relToMouse);
                float angleToMouse = atan(relToMouse.y, relToMouse.x);
                vec2 dirToMouse = normalize(relToMouse + vec2(0.0001, 0.0));
                
                float shapeFactor = noise(dirToMouse * 2.0 + vec2(0.0, uTime * 0.1));
                
                float radiusBase = uHaloRadiusBase;
                float radiusAmplitude = uHaloRadiusAmplitude;
                float shapeAmplitude = uHaloShapeAmplitude;
                float rimWidth = uHaloRimWidth;
                float outerStartOffset = uHaloOuterStartOffset;
                float outerEndOffset = uHaloOuterEndOffset;

                float breathCycle = sin(uTime * 0.8);
                
                float baseRadius = radiusBase + breathCycle * radiusAmplitude;
                float currentRadius = baseRadius + (shapeFactor * shapeAmplitude);
                
                float dist = distFromMouse; 
                float rimInfluence = smoothstep(rimWidth, 0.0, abs(dist - currentRadius));
                
                vec2 pushDir = normalize(relToMouse + vec2(0.0001, 0.0));
                
                float pushAmt = (breathCycle * 0.5 + 0.5) * 0.5;
                
                pos.xy += pushDir * pushAmt * rimInfluence;
                
                pos.z += rimInfluence * 0.3 * sin(uTime);

                // --- 3.5 OUTER OSCILLATION (Smooth, Faster) ---
                float outerInfluence = smoothstep(baseRadius + outerStartOffset, baseRadius + outerEndOffset, dist);
                float outerOsc = sin(uTime * uOuterOscFrequency + pos.x * 0.6 + pos.y * 0.6);
                pos.xy += normalize(relToMouse + vec2(0.0001, 0.0)) * outerOsc * uOuterOscAmplitude * outerInfluence;

                // --- 4. SIZE & SCALE ---
                
                float baseSize = uParticleBaseSize + (sin(uTime + pos.x)*0.003);
                
                float activeSize = uParticleActiveSize; 
                float currentScale = baseSize + (rimInfluence * activeSize);
                
                float stretch = rimInfluence * 0.02;
                
                vec3 transformed = position;
                transformed.x *= (currentScale + stretch) * uBlobScaleX;
                transformed.y *= currentScale * uBlobScaleY; 
                
                vSize = rimInfluence;
                vPos = pos.xy;
                
                // --- 5. ROTATION ---
                
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
                vec2 center = vec2(0.5);
                vec2 pos = abs(vUv - center) * 2.0; 
                
                float d = pow(pow(pos.x, 2.6) + pow(pos.y, 2.6), 1.0/2.6);
                float alpha = 1.0 - smoothstep(0.8, 1.0, d);
                
                if (alpha < 0.01) discard;

                vec3 black = vec3(0.08, 0.08, 0.1);
                vec3 cBlue = vec3(0.26, 0.52, 0.96);
                vec3 cRed = vec3(0.92, 0.26, 0.21);
                vec3 cYellow = vec3(0.98, 0.73, 0.01);
                
                float t = uTime * 1.2;
                
                float p1 = sin(vPos.x * 0.8 + t);
                float p2 = sin(vPos.y * 0.8 + t * 0.8 + p1);
                
                vec3 activeColor = mix(cBlue, cRed, p1 * 0.5 + 0.5);
                activeColor = mix(activeColor, cYellow, p2 * 0.5 + 0.5);
                
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
    material.uniforms.uOuterOscFrequency.value = merged.halo.outerOscFrequency;
    material.uniforms.uOuterOscAmplitude.value = merged.halo.outerOscAmplitude;
    material.uniforms.uHaloRadiusBase.value = merged.halo.radiusBase;
    material.uniforms.uHaloRadiusAmplitude.value = merged.halo.radiusAmplitude;
    material.uniforms.uHaloShapeAmplitude.value = merged.halo.shapeAmplitude;
    material.uniforms.uHaloRimWidth.value = merged.halo.rimWidth;
    material.uniforms.uHaloOuterStartOffset.value = merged.halo.outerStartOffset;
    material.uniforms.uHaloOuterEndOffset.value = merged.halo.outerEndOffset;
    material.uniforms.uParticleBaseSize.value = merged.particles.baseSize;
    material.uniforms.uParticleActiveSize.value = merged.particles.activeSize;
    material.uniforms.uBlobScaleX.value = merged.particles.blobScaleX;
    material.uniforms.uBlobScaleY.value = merged.particles.blobScaleY;
  }, [material, merged]);

  useEffect(() => {
    if (!meshRef.current) return;

    const offsets = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const angles = new Float32Array(count);

    const gridWidth = 40;
    const gridHeight = 22;
    const jitter = 0.25;

    let i = 0;
    for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
        const u = x / (countX - 1);
        const v = y / (countY - 1);

        let px = (u - 0.5) * gridWidth;
        let py = (v - 0.5) * gridHeight;

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

    let targetX = null;
    let targetY = null;

    if (hovering.current) {
      const baseX = (pointer.x * viewport.width) / 2;
      const baseY = (pointer.y * viewport.height) / 2;
      const t = clock.getElapsedTime();
      const jitterRadius =
        Math.min(viewport.width, viewport.height) * merged.cursor.radius;
      const jitterX = (Math.sin(t * 0.35) + Math.sin(t * 0.77 + 1.2)) * 0.5;
      const jitterY = (Math.cos(t * 0.31) + Math.sin(t * 0.63 + 2.4)) * 0.5;
      targetX = baseX + jitterX * jitterRadius * merged.cursor.strength;
      targetY = baseY + jitterY * jitterRadius * merged.cursor.strength;
    }

    const current = material.uniforms.uMouse.value;
    const dragFactor = merged.cursor.dragFactor;

    if (targetX !== null && targetY !== null) {
      current.x += (targetX - current.x) * dragFactor;
      current.y += (targetY - current.y) * dragFactor;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

const Medusae = ({ className, config, style }) => {
  return (
    <div className={className ? `medusae-root ${className}` : "medusae-root"} style={style}>
      <Canvas className="medusae-canvas" camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#ffffff"]} />
        <Particles config={config} />
      </Canvas>
    </div>
  );
};

export default Medusae;
