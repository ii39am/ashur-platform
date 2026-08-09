import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function GlobeSphere() {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  // Hotspots around the globe (lat/long converted to 3D sphere)
  const hotspots: [number, number, number][] = [
    [0.8, 1.2, 1.2],   // North America
    [-0.5, 1.4, 1.1],  // Europe
    [1.3, 0.4, 1.1],   // Middle East (Riyadh/Dubai)
    [1.5, -0.2, 0.9],  // Asia Pacific (Tokyo)
    [-1.2, -0.8, 1.0], // South America
  ];

  return (
    <group ref={globeRef}>
      {/* Wireframe Outer Sphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[1.92, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Pulsing Hotspot Pins */}
      {hotspots.map((pos, i) => (
        <Float key={i} speed={3} floatIntensity={0.2}>
          <mesh position={pos}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export const InteractiveGlobe: React.FC = () => {
  return (
    <div className="w-full h-[320px] relative">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <GlobeSphere />
      </Canvas>

      {/* Overlay Badge */}
      <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2 border border-white/10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-white">Live Global Network: 50+ Nodes Active</span>
      </div>
    </div>
  );
};
