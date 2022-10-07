import { BackSide } from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { ringSegments } from "./Scene";
import { a, SpringValue } from "@react-spring/three";

const AnimatedDistortMaterial = a(MeshDistortMaterial);

export interface OuterCircleProps {
  radius: number;
  wireframe: boolean;
  circleInnerRadius: number;
  thetaStart: number;
  thetaLength: number;
  color: string;
  zPos: number;
  distortSpeed: number;
  emissiveIntensity: number;
  outerCircleSpring?: {
    opacity: SpringValue<number>;
    scale: SpringValue<number[]>;
  };
}

const OuterCircle = ({
  radius,
  wireframe,
  circleInnerRadius,
  emissiveIntensity,
  thetaStart,
  thetaLength,
  color,
  zPos,
  distortSpeed,
  outerCircleSpring,
}: OuterCircleProps) => {
  return (
    <a.mesh
      // @ts-ignore
      scale={outerCircleSpring?.scale}
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
      {/*
      // @ts-ignore */}
      <AnimatedDistortMaterial
        side={BackSide}
        attach="material"
        color={color}
        factor={0}
        speed={distortSpeed}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.4}
        metalness={0.8}
        transparent
        opacity={outerCircleSpring?.opacity || 0.01}
        wireframe={wireframe}
      />
    </a.mesh>
  );
};

export default OuterCircle;
