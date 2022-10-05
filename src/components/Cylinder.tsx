import { FrontSide, NormalBlending, Vector3 } from "three";
import { pickRandomHash } from "../utils";

export interface CylinderProps {
  radiusTop: number;
  radiusBottom: number;
  color: string;
  position: Vector3;
}

const SEGMENTS = [3, 4, 8, 64];

const Cylinder = ({
  radiusTop,
  radiusBottom,
  color,
  position,
}: CylinderProps) => {
  const segments = pickRandomHash(SEGMENTS);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1, 1, 1]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[radiusTop, radiusBottom, 0.2, segments, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.5}
        side={FrontSide}
        blending={NormalBlending}
      />
    </mesh>
  );
};

export default Cylinder;
