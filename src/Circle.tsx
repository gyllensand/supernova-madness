import { BackSide, Euler } from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { a, SpringValue } from "@react-spring/three";

export interface CircleProps {
  radius: number;
  wireframe: boolean;
  thetaStart: number;
  color: string;
  zPos: number;
  distortSpeed: number;
  circleSpring?: { rotation: SpringValue<number[]> };
}

const Circle = ({
  radius,
  wireframe,
  thetaStart,
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
    </a.mesh>
  );
};

export default Circle;
