import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Particles = () => {
    const meshRef = useRef();
    const { viewport } = useThree();

    // User: "Add a bit more particles"
    const countX = 80;
    const countY = 45;
    const count = countX * countY;

    // Use a Plane for the pill shape. We will stretch it in the shader.
    const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }), []);

    const material = useMemo(() => new THREE.ShaderMaterial({
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
                
                // --- 1. JELLYFISH BREATHING (ORGANIC & 3D) ---
                vec3 pos = aOffset;
                
                vec2 relToMouse = pos.xy - uMouse;
                float distFromMouse = length(relToMouse);
                float angleToMouse = atan(relToMouse.y, relToMouse.x);
                
                // Add noise to the distance field to break the perfect circle
                // Reduced noise amplitude so the "Loop" is still recognizable
                float waveNoise = noise(vec2(angleToMouse * 2.5, uTime * 0.4));
                float organicDist = distFromMouse + (waveNoise * 0.8); 
                
                // Radial Wave
                float breathSpeed = 1.4;
                float breathFreq = 0.6;
                float breathPhase = uTime * breathSpeed - organicDist * breathFreq;
                
                float breathWave = sin(breathPhase);
                
                // 3D EFFECT: Z-displacement
                // User said "Effect is waaaay too big". Toning down Z-pop.
                float zAmp = 0.5; 
                pos.z += breathWave * zAmp;
                
                // XY Displacement
                vec2 radialDir = normalize(relToMouse + vec2(0.0001, 0.0));
                float movementAmp = 0.2 + (waveNoise * 0.1); 
                pos.xy += radialDir * breathWave * movementAmp;

                // --- 2. MOUSE INTERACTION (RIM & CENTER) ---
                
                float edgeNoise = noise(vec2(angleToMouse * 6.0, uTime * 0.8)) * 0.5;
                float dist = organicDist + edgeNoise;
                
                // User: "Reduce smaller radius" / "Too dispersed"
                float rimRadius = 2.2; 
                float rimWidth = 1.6; 
                float rimDist = abs(dist - rimRadius);
                float influence = 1.0 - smoothstep(0.0, rimWidth, rimDist);
                
                // --- 3. SIZE & SCALE ---
                
                float waveScale = smoothstep(-1.0, 1.0, breathWave); // 0..1
                float pulsingBase = 0.01 + waveScale * 0.012; 
                
                // Sizing tweaks
                float activeBoost = 0.05; 
                float centerFactor = smoothstep(rimRadius, 0.0, dist); 
                float centerBoost = centerFactor * 0.015; 
                
                float currentScale = pulsingBase + (influence * activeBoost) + centerBoost;
                
                // Stretch logic
                float stretch = influence * 0.05; 
                
                vec3 transformed = position;
                transformed.x *= (currentScale + stretch);
                transformed.y *= currentScale * 0.9; 
                
                vSize = influence;
                vPos = pos.xy;
                
                // --- 4. ROTATION ---
                // User: "Must be directed towards mouse" (Radial)
                
                // atan(y, x) gives angle of vector FROM mouse TO particle.
                // Aligning with this makes them point radially (like rays/spokes).
                float targetAngle = angleToMouse; 
                
                // Apply rotation everywhere based on mouse field
                float finalAngle = targetAngle; 
                
                transformed.xy = rotate2d(finalAngle) * transformed.xy;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + transformed, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying float vSize;
            varying vec2 vPos;

            void main() {
                // Shape: "Rectangle with radius" (Squarcle / Superellipse)
                // A simple circle stretches into an oval. 
                // A superellipse stretches into a rounded box/pill look.
                vec2 center = vec2(0.5);
                vec2 pos = abs(vUv - center) * 2.0; // -1..1 range approx normalized
                
                // Power 4.0 creates a "Squarcle"
                float d = pow(pow(pos.x, 4.0) + pow(pos.y, 4.0), 1.0/4.0);
                
                // Edge at 1.0 (normalized) which corresponds to 0.5 in UV space
                // We use 0.0 -> 1.0 gradient in the math above
                // So smoothstep around 0.8 to keeping it contained
                float alpha = 1.0 - smoothstep(0.8, 1.0, d);
                
                if (alpha < 0.01) discard;

                // Colors
                vec3 black = vec3(0.08, 0.08, 0.1);
                
                vec3 cBlue = vec3(0.26, 0.52, 0.96);
                vec3 cRed = vec3(0.92, 0.26, 0.21);
                vec3 cYellow = vec3(0.98, 0.73, 0.01);
                
                float p = sin(vPos.x * 0.5 + vPos.y * 0.5);
                vec3 activeColor = cBlue;
                if (p > 0.5) activeColor = cRed;
                else if (p < -0.5) activeColor = cYellow;
                
                vec3 finalColor = mix(black, activeColor, smoothstep(0.2, 1.0, vSize));
                float finalAlpha = alpha * mix(0.4, 0.95, vSize);

                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `,
        transparent: true,
        depthWrite: false,
    }), [uniforms]);

    useEffect(() => {
        if (!meshRef.current) return;

        // Populate attributes
        const offsets = new Float32Array(count * 3);
        const randoms = new Float32Array(count);
        const angles = new Float32Array(count); // Random initial angles

        // Spread them out more since we reduced count
        const gridWidth = 40;
        const gridHeight = 22;
        const jitter = 0.6; // High jitter for "not a perfect grid"

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

        meshRef.current.geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
        meshRef.current.geometry.setAttribute('aRandom', new THREE.InstancedBufferAttribute(randoms, 1));
        meshRef.current.geometry.setAttribute('aAngleOffset', new THREE.InstancedBufferAttribute(angles, 1));

    }, [count, countX, countY]);

    useFrame((state) => {
        const { clock, pointer } = state;
        material.uniforms.uTime.value = clock.getElapsedTime();

        // World space mouse
        const x = (pointer.x * viewport.width) / 2;
        const y = (pointer.y * viewport.height) / 2;

        // Smooth mouse
        const current = material.uniforms.uMouse.value;
        current.x += (x - current.x) * 0.1;
        current.y += (y - current.y) * 0.1;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, material, count]}
        />
    );
};

export default Particles;