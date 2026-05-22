import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export function EnergyScene() {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(5000 * 3);

    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;
      const radius = 1.5 + Math.random() * 3.5;
      const spin = radius * 2;
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = Math.cos(angle + spin) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = Math.sin(angle + spin) * radius;
    }

    return positions;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.3;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.15) * 0.3;
      pointsRef.current.position.y = Math.sin(elapsed * 0.08) * 0.5;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        <mesh position={[0, 0, -2]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshPhysicalMaterial
            transmission={0.85}
            roughness={0.05}
            metalness={0.05}
            thickness={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            ior={1.45}
            envMapIntensity={1}
            color="#d9f7e4"
            opacity={0.95}
            transparent
          />
        </mesh>
      </Float>

      <Points ref={pointsRef} positions={particles} stride={3}>
        <PointMaterial
          transparent
          color="#22c55e"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          emissive="#22c55e"
          emissiveIntensity={1.2}
          fog={false}
        />
      </Points>
    </group>
  );
}
