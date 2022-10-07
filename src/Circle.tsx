import { BackSide, Euler, Mesh, RingGeometry } from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { a, SpringValue } from "@react-spring/three";
import { ringSegments } from "./Scene";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const AnimatedDistortMaterial = a(MeshDistortMaterial);

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
  const ref = useRef<Mesh<RingGeometry>>();
  useFrame(() => {
    if (!ref.current) {
      return;
    }

    // @ts-ignore
    // ref.current.speed = 10;

    // console.log(ref.current.geometry);
    // console.log(circleSpring?.distortSpeed.get());
  });

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
      {/*
      // @ts-ignore */}
      <AnimatedDistortMaterial
        ref={ref}
        side={BackSide}
        attach="material"
        color={color}
        factor={0}
        speed={distortSpeed}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        // blending={NormalBlending}
        roughness={0.4}
        metalness={0.8}
        transparent
        opacity={0.5}
        wireframe={wireframe}
      />
    </a.mesh>
  );
};

export default Circle;
