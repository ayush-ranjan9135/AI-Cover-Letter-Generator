import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const AnimatedSphere = ({ color }) => {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.2;
      mesh.current.distort = THREE.MathUtils.lerp(
        mesh.current.distort,
        0.4 + Math.sin(state.clock.elapsedTime) * 0.1,
        0.05
      );
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 100, 200]} scale={2.2}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const LiquidIntelligence = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const sphereColor = isLight ? '#2563eb' : '#3b82f6';

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      zIndex: 1, pointerEvents: 'none', 
      opacity: isLight ? 0.4 : 0.6,
      transition: 'opacity 0.8s ease'
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true }}>
        <ambientLight intensity={isLight ? 1.0 : 0.4} />
        <pointLight position={[10, 10, 10]} intensity={isLight ? 0.8 : 1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <AnimatedSphere color={sphereColor} />
        </Float>
      </Canvas>
    </div>
  );
};

export default LiquidIntelligence;
