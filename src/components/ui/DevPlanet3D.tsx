import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DevPlanet } from '../../types';

interface DevPlanet3DProps {
  planet: DevPlanet;
  onClick?: () => void;
}

export const DevPlanet3D: React.FC<DevPlanet3DProps> = ({ planet, onClick }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.005;
    }
  });

  const createRings = () => {
    const rings = [];
    for (let i = 0; i < planet.rings; i++) {
      rings.push(
        <Ring
          key={i}
          args={[planet.size + 0.5 + i * 0.3, planet.size + 0.7 + i * 0.3, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={0.3 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </Ring>
      );
    }
    return rings;
  };

  return (
    <group position={planet.position} onClick={onClick}>
      {/* Planet Core */}
      <Sphere ref={planetRef} args={[planet.size, 32, 32]}>
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {/* Planet Rings */}
      <group ref={ringsRef}>
        {createRings()}
      </group>

      {/* Planet Name */}
      <Text
        position={[0, planet.size + 1, 0]}
        fontSize={0.3}
        color={planet.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron.woff"
      >
        {planet.name}
      </Text>

      {/* Ambient Light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        color={planet.color}
        distance={5}
      />
    </group>
  );
};