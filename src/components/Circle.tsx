import { useEffect, useRef } from "react";
import { BackSide, CylinderGeometry, Mesh } from "three";
import { MeshDistortMaterial } from "@react-three/drei";

export interface CircleProps {
  radius: number;
  wireframe: boolean;
  thetaStart: number;
  color: string;
  zPos: number;
  distortSpeed: number;
  reference?: any;
}

const Circle = ({
  radius,
  wireframe,
  thetaStart,
  color,
  zPos,
  distortSpeed,
}: CircleProps) => {
  return (
    <mesh position={[0, 0, zPos]} scale={[1, 1, 1]} castShadow receiveShadow>
      <ringGeometry args={[0.3, radius, 64, 3, thetaStart, Math.PI / 2]} />
      <MeshDistortMaterial
        side={BackSide}
        attach="material"
        color={color}
        factor={0}
        speed={distortSpeed}
        emissive={color}
        emissiveIntensity={0.5}
        // blending={NormalBlending}
        roughness={0.4}
        metalness={0.8}
        transparent
        opacity={0.5}
        wireframe={wireframe}
      />
    </mesh>
  );
};

export default Circle;
