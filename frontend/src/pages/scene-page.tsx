import {
  CameraControls,
  Edges,
  Environment,
  MeshPortalMaterial,
  PivotControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { PageTitle } from "../components/page-title";

export function ScenePage() {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>3D Scene</PageTitle>

        <div className="text-center text-balance text-black/75 md:w-[70%]">
          Drag to rotate, scroll to zoom, right-click to pan
        </div>
      </div>

      <div className="h-[600px] w-full">
        <Canvas shadows camera={{ position: [-3, 0.5, 3] }}>
          <PivotControls
            anchor={[-1.1, -1.1, -1.1]}
            scale={0.75}
            lineWidth={3.5}
            visible={false}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2, 2, 2]} />
              <Edges />
              <Side rotation={[0, 0, 0]} bg="orange" index={0}>
                <torusGeometry args={[0.65, 0.3, 64]} />
              </Side>
              <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
                <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
              </Side>
              <Side
                rotation={[0, Math.PI / 2, Math.PI / 2]}
                bg="lightgreen"
                index={2}
              >
                <boxGeometry args={[1.15, 1.15, 1.15]} />
              </Side>
              <Side
                rotation={[0, Math.PI / 2, -Math.PI / 2]}
                bg="aquamarine"
                index={3}
              >
                <octahedronGeometry />
              </Side>
              <Side rotation={[0, -Math.PI / 2, 0]} bg="indianred" index={4}>
                <icosahedronGeometry />
              </Side>
              <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
                <dodecahedronGeometry />
              </Side>
            </mesh>
          </PivotControls>
          <CameraControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}

interface SideProps {
  rotation?: [number, number, number];
  bg?: string;
  children?: React.ReactNode;
  index: number;
}

function Side({
  rotation = [0, 0, 0],
  bg = "#f0f0f0",
  children,
  index,
}: SideProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.SpotLight>(null!);
  const { nodes } = useGLTF("/aobox-transformed.glb") as any;

  useLayoutEffect(() => {
    if (lightRef.current) {
      lightRef.current.shadow.normalBias = 0.05;
      lightRef.current.shadow.bias = 0.0001;
      lightRef.current.shadow.mapSize.width = 2048;
      lightRef.current.shadow.mapSize.height = 2048;
      lightRef.current.shadow.camera.near = 0.5;
      lightRef.current.shadow.camera.far = 500;
      lightRef.current.shadow.camera.updateProjectionMatrix();
    }
  }, []);

  useFrame((_state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += delta;
    }
  });

  return (
    // @ts-expect-error - MeshPortalMaterial attach prop type issue
    <MeshPortalMaterial attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/** A box with baked AO */}
      <mesh
        castShadow
        receiveShadow
        rotation={rotation}
        geometry={nodes.Cube.geometry}
      >
        <meshStandardMaterial
          aoMapIntensity={1}
          aoMap={nodes.Cube.material.aoMap}
          color={bg}
        />
        <spotLight
          ref={lightRef}
          castShadow
          color={bg}
          intensity={2}
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
        />
      </mesh>
      {/** The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        {children}
        <meshStandardMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
}
