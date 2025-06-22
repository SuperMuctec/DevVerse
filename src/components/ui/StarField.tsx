import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Stars: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  
  const sphere = new Float32Array(2000 * 3);
  
  for (let i = 0; i < 2000; i++) {
    const radius = Math.random() * 50 + 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    sphere[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    sphere[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    sphere[i * 3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarField: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
      </Canvas>
    </div>
  );
};