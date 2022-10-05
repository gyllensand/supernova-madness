import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RefObject, useEffect, useMemo, useRef } from "react";
import { start } from "tone";
import {
  getRandomNumber,
  getSizeByAspect,
  pickRandomBoolean,
  pickRandomColorWithTheme,
  pickRandomDecimalFromInterval,
  pickRandomHash,
  pickRandomIntFromInterval,
  pickRandomSphericalPos,
} from "./utils";
import {
  EffectComposer,
  SSAO,
  SelectiveBloom,
} from "@react-three/postprocessing";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import { Vector3, Vector2, SpotLight, AmbientLight } from "three";
import Circle, { CircleProps } from "./components/Circle";
import {
  BG_THEME,
  DARK_BG_COLORS,
  DARK_COLORS,
  LIGHT_BG_COLORS,
  LIGHT_COLORS,
} from "./constants";
import Cylinder, { CylinderProps } from "./components/Cylinder";

const circleCount = pickRandomIntFromInterval(20, 30);
const circleWireframe = pickRandomBoolean();

const bgTheme = pickRandomHash(BG_THEME);
const bgColor = pickRandomHash(
  bgTheme === 0 ? LIGHT_BG_COLORS : DARK_BG_COLORS
);
const primaryTheme = bgTheme === 0 ? DARK_COLORS : LIGHT_COLORS;
const primaryBg = pickRandomHash(primaryTheme);

// @ts-ignore
// window.$fxhashFeatures = {
//   instrument,
//   xRowCount: ROW_X,
//   yRowCount: ROW_Y,
//   zRowCount: ROW_Z,
//   bgColor,
//   primaryColor,
//   secondaryColor,
// };

function getRandomPointInsideCircle(offset) {
  const r = (offset * Math.sqrt(Math.random())) / 2;
  const theta = Math.random() * 2 * Math.PI;
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  return new Vector2(x, y);
}

const Scene = ({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) => {
  const toneInitialized = useRef(false);
  const { aspect, clock, viewport, size } = useThree((state) => ({
    aspect: state.viewport.aspect,
    clock: state.clock,
    viewport: state.viewport,
    size: state.size,
  }));

  const noise = createNoise2D(getRandomNumber);
  const noiseZ = useRef(0);

  const ambientRef = useRef<AmbientLight>();
  const mainLightRef = useRef<SpotLight>();
  const centerLightRef = useRef<SpotLight>();
  // useHelper(mainLightRef, SpotLightHelper, "green");
  // useHelper(centerLightRef, SpotLightHelper, "red");

  useEffect(() => {
    mainLightRef.current?.target.position.set(0, 0, 7.5);
    mainLightRef.current?.target.updateMatrixWorld();
    centerLightRef.current?.target.position.set(0, 0, 7.5);
    centerLightRef.current?.target.updateMatrixWorld();
  }, []);

  const circles = useMemo(
    () =>
      new Array(circleCount).fill(null).map<CircleProps>((o, i) => {
        return {
          radius: pickRandomDecimalFromInterval(1.5, 3),
          // radius: 4 - i / 15,
          thetaStart: pickRandomDecimalFromInterval(0, Math.PI * 2),
          wireframe: circleWireframe,
          color: pickRandomColorWithTheme(primaryBg, primaryTheme, 10),
          zPos: 1 - i / 8,
          distortSpeed: pickRandomDecimalFromInterval(0.1, 1),
        };
      }),
    []
  );

  const cylinders = useMemo(
    () =>
      new Array(3).fill(null).map<CylinderProps>(() => ({
        radiusTop: pickRandomDecimalFromInterval(0.9, 1),
        radiusBottom: pickRandomDecimalFromInterval(1, 1.1),
        color: pickRandomHash(LIGHT_COLORS),
        position: new Vector3(
          pickRandomDecimalFromInterval(-3, 3),
          pickRandomDecimalFromInterval(-3, 3),
          pickRandomDecimalFromInterval(-1, 2)
        ),
      })),
    []
  );

  return (
    <>
      <OrbitControls enabled={true} />
      <ambientLight ref={ambientRef} intensity={0.2} />
      {/* <pointLight position={[-2, 0, -2]} intensity={3} /> */}
      <spotLight
        ref={mainLightRef}
        position={[0, 15, -7.5]}
        penumbra={1}
        intensity={3}
        distance={30}
        angle={7}
      />
      <spotLight
        ref={centerLightRef}
        position={[0, 0, -15]}
        intensity={1}
        penumbra={1}
        distance={25}
        angle={0.15}
      />

      <group
        position={[0, 0, 5]}
        scale={[
          getSizeByAspect(1, aspect),
          getSizeByAspect(1, aspect),
          getSizeByAspect(1, aspect),
        ]}
      >
        {/* {cylinders.map((o, i) => (
          <Cylinder key={i} {...o} />
        ))} */}

        {circles.map((o, i) => (
          <Circle key={i} {...o} />
        ))}
      </group>
      <mesh receiveShadow position={[0, 0, 7.5]} rotation={[-Math.PI, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color={bgColor} />
      </mesh>
      {/* <EffectComposer multisampling={0}>
        <SSAO
          samples={31}
          radius={10}
          intensity={18}
          luminanceInfluence={0.1}
          color="#000000"
        />
      </EffectComposer> */}
      {/* <EffectComposer autoClear={false}>
        <SelectiveBloom
          selection={[circleRef]}
          intensity={0.5}
          luminanceThreshold={0.01}
          luminanceSmoothing={0.025}
          lights={[ambientRef]}
        />
      </EffectComposer> */}
    </>
  );
};

export default Scene;
