"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import type { BackgroundEffect, DeckTheme } from "@/types/deck";

interface SceneProps {
  effect: BackgroundEffect;
  theme: DeckTheme;
  slideIndex: number;
}

function CameraRig({ slideIndex }: { slideIndex: number }) {
  useFrame((state) => {
    const targetX = Math.sin(slideIndex * 0.7) * 1.4;
    const targetY = Math.cos(slideIndex * 0.55) * 0.6;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.04
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function FloatingOrbs({ colorA, colorB }: { colorA: string; colorB: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <group ref={group}>
      {[
        [-2.2, 0.8, -2],
        [2.4, -0.6, -1.5],
        [0.2, 1.4, -3],
        [-1.2, -1.1, -2.5],
      ].map((pos, i) => (
        <Float
          key={i}
          speed={1.2 + i * 0.2}
          rotationIntensity={0.4}
          floatIntensity={1.2}
        >
          <mesh position={pos as [number, number, number]}>
            <sphereGeometry args={[0.35 + i * 0.08, 32, 32]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? colorA : colorB}
              emissive={i % 2 === 0 ? colorA : colorB}
              emissiveIntensity={0.55}
              roughness={0.25}
              metalness={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function MeshGradient({ colorA, colorB }: { colorA: string; colorB: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -4]} scale={[8, 5, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <meshStandardMaterial
        color={colorA}
        emissive={colorB}
        emissiveIntensity={0.35}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function ParticleField({ color }: { color: string }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ effect, theme, slideIndex }: SceneProps) {
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;

  return (
    <>
      <color attach="background" args={[theme.colors.background]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 2]} intensity={1.2} color={primary} />
      <pointLight position={[-4, -2, 1]} intensity={0.8} color={secondary} />
      <CameraRig slideIndex={slideIndex} />

      {(effect === "starfield" ||
        effect === "aurora" ||
        effect === "3d-particles") && (
        <Stars
          radius={60}
          depth={40}
          count={2500}
          factor={3.5}
          saturation={0}
          fade
          speed={0.6}
        />
      )}

      {(effect === "floating-orbs" || effect === "aurora") && (
        <FloatingOrbs colorA={primary} colorB={secondary} />
      )}

      {(effect === "cyber-grid" || effect === "gradient") && (
        <MeshGradient colorA={primary} colorB={secondary} />
      )}

      {(effect === "3d-particles" ||
        effect === "starfield" ||
        effect === "color") && <ParticleField color={primary} />}
    </>
  );
}

export function ProBackdrop({
  effect,
  theme,
  slideIndex,
}: {
  effect: BackgroundEffect;
  theme: DeckTheme;
  slideIndex: number;
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene effect={effect} theme={theme} slideIndex={slideIndex} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
    </div>
  );
}
