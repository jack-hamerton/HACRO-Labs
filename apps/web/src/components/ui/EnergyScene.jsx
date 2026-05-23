import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export function EnergyScene() {
  const pointsRef = useRef();
  const scroll = useScroll();

  const particles = useMemo(() => {
    const positions = new Float32Array(5000 * 3);

    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;
      const radius = 1.5 + Math.random() * 4.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const offset = scroll.offset;

    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * (0.35 + offset * 0.25);
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.12;
    pointsRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.06;
    pointsRef.current.position.y = Math.sin(elapsed * 0.12) * 0.35 + offset * 0.25;
    pointsRef.current.position.z = Math.sin(elapsed * 0.1) * 0.2 - offset * 0.25;
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.4}>
        <mesh position={[0, 0, -1.5]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.04}
            metalness={0.1}
            transmission={0.85}
            thickness={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            opacity={0.95}
            transparent
          />
        </mesh>
      </Float>

      <Points ref={pointsRef} positions={particles} stride={3}>
        <PointMaterial
          transparent
          color="#22c55e"
          size={0.16}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
