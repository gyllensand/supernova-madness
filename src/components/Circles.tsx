import { ReactNode, useEffect, useMemo, useRef } from "react";
import {
  Color,
  CylinderGeometry,
  FrontSide,
  InstancedMesh,
  NormalBlending,
  Object3D,
  Vector3,
} from "three";
import { pickRandomDecimalFromInterval } from "../utils";
import { MeshDistortMaterial } from "@react-three/drei";

export interface CircleProps {
  radius: number;
  thetaLength: number;
  thetaStart: number;
  color: string;
  zPos: number;
  distort: boolean;
  distortSpeed: number;
}

const Circles = ({ objects }: { objects: CircleProps[] }) => {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const meshRef = useRef<InstancedMesh<CylinderGeometry>>();
  const hej = useRef<CylinderGeometry>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          // @ts-ignore
          .flatMap((o, i) => tempColor.set(objects[i].color).toArray())
      ),
    [tempColor, objects]
  );

  // radius: 3,
  // thetaStart: pickRandomDecimalFromInterval(0, Math.PI * 2),
  // thetaLength: pickRandomDecimalFromInterval(Math.PI / 2, Math.PI / 2),
  // color: pickRandomColorWithTheme(
  //   pickRandomHash(NEW_COLORS),
  //   NEW_COLORS,
  //   40
  // ),
  // zPos: pickRandomDecimalFromInterval(-2, 2),
  // distort: true,
  // distortSpeed: pickRandomDecimalFromInterval(0.1, 1),

  useEffect(() => {
    if (!meshRef.current) {
      return;
    }

    objects.forEach((o, i) => {
      if (!meshRef.current) {
        return;
      }

      console.log(meshRef.current.geometry.attributes);
      tempObject.scale.set(o.radius, o.radius, 1);
      // tempObject.rotateOnAxis(new Vector3(0, 0, 0), 2);
      tempObject.position.set(0, 0, o.zPos);
      tempObject.updateMatrix();

      meshRef.current.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [objects, tempObject]);

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, objects.length]}
      >
        <cylinderGeometry
          ref={hej}
          args={[3, 3, 0.2, 64, 64, false, 0, Math.PI / 2]}
        >
          <instancedBufferAttribute
            attachObject={["attributes", "color"]}
            args={[colorArray, 3]}
          />
        </cylinderGeometry>
        <meshStandardMaterial
          // emissiveIntensity={0.5}
          // blending={NormalBlending}
          transparent
          opacity={0.5}
          roughness={0.5}
          metalness={1}
          side={FrontSide}
        />
        {/* <MeshDistortMaterial
          side={FrontSide}
          attach="material"
          // color={color}
          factor={0}
          speed={1}
          // emissive={color}
          emissiveIntensity={0.5}
          blending={NormalBlending}
          transparent
          opacity={0.5}
          //   wireframe
        /> */}
      </instancedMesh>
    </group>
  );
};

export default Circles;
