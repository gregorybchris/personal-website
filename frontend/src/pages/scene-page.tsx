import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { PageTitle } from "../components/page-title";

export function ScenePage() {
  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>3D Scene</PageTitle>

        <div className="text-center text-balance text-black/75 md:w-[70%]">
          Drag to rotate, scroll to zoom, right-click to pan
        </div>
      </div>

      <div className="h-[600px] w-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.5}
            color="#4f46e5"
          />

          {/* 3D Objects */}
          <RotatingCube position={[-2, 0, 0]} />
          <BouncingSphere position={[2, 0, 0]} />
          <mesh position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.3, 16, 100]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>

          {/* Orbit controls for interaction */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={20}
          />
        </Canvas>
      </div>
    </div>
  );
}

function RotatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  );
}

function BouncingSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.75, 32, 32]} />
      <meshStandardMaterial color={hovered ? "#f59e0b" : "#10b981"} />
    </mesh>
  );
}
