import { BackSide } from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { a, SpringValue } from "@react-spring/three";
import { circleRoughness, ringSegments } from "./Scene";

export interface CircleProps {
  radius: number;
  wireframe: boolean;
  circleInnerRadius: number;
  thetaStart: number;
  thetaLength: number;
  color: string;
  zPos: number;
  distortSpeed: number;
  emissiveIntensity: number;
  circleSpring?: {
    scale: SpringValue<number[]>;
    rotation: SpringValue<number[]>;
  };
}

const Circle = ({
  radius,
  wireframe,
  circleInnerRadius,
  emissiveIntensity,
  thetaStart,
  thetaLength,
  color,
  zPos,
  distortSpeed,
  circleSpring,
}: CircleProps) => {
  return (
    <a.mesh
      {...(circleSpring as any)}
      position={[0, 0, zPos]}
      castShadow
      receiveShadow
    >
      <ringGeometry
        args={[
          circleInnerRadius,
          radius,
          ringSegments,
          3,
          thetaStart,
          thetaLength,
        ]}
      />

      <MeshDistortMaterial
        side={BackSide}
        attach="material"
        color={color}
        factor={0}
        speed={distortSpeed}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        {...circleRoughness}
        transparent
        opacity={0.5}
        wireframe={wireframe}
      />
    </a.mesh>
  );
};

export default Circle;
