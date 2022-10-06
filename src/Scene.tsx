import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { start } from "tone";
import {
  getSizeByAspect,
  getSizeByWidthAspect,
  pickRandomBoolean,
  pickRandomColorWithTheme,
  pickRandomDecimalFromInterval,
  pickRandomHash,
  pickRandomIntFromInterval,
  sortRandom,
} from "./utils";
import {
  EffectComposer,
  SSAO,
  SelectiveBloom,
} from "@react-three/postprocessing";
import { useSprings } from "@react-spring/three";
import { Vector2, SpotLight, AmbientLight } from "three";
import Circle, { CircleProps } from "./Circle";
import {
  DARK_BG_COLORS,
  DARK_COLORS,
  LIGHT_BG_COLORS,
  LIGHT_COLORS,
} from "./constants";

const circleCount = pickRandomIntFromInterval(20, 30);
const circleWireframe = pickRandomBoolean();

const bgTheme = pickRandomHash([0, 1]);
const bgColor = pickRandomHash(
  bgTheme === 0 ? LIGHT_BG_COLORS : DARK_BG_COLORS
);
const primaryTheme = bgTheme === 0 ? DARK_COLORS : LIGHT_COLORS;
const primaryColor = pickRandomHash(primaryTheme);

// @ts-ignore
window.$fxhashFeatures = {
  // instrument,
  circleCount,
  wireframe: circleWireframe,
  bgColor,
  primaryColor,
};

const circles = new Array(circleCount).fill(null).map<CircleProps>((o, i) => ({
  radius: pickRandomDecimalFromInterval(1.5, 3),
  // radius: 4 - i / 15,
  thetaStart: pickRandomDecimalFromInterval(0, Math.PI * 2),
  wireframe: circleWireframe,
  color: pickRandomColorWithTheme(primaryColor, primaryTheme, 10),
  zPos: 1 - i / 8,
  distortSpeed: pickRandomDecimalFromInterval(0.1, 1),
}));

const Scene = ({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) => {
  const toneInitialized = useRef(false);
  const { aspect } = useThree((state) => ({
    aspect: state.viewport.aspect,
  }));

  // const [lastPlayedSample, setLastPlayedSample] = useState<Sample>();
  // const availableChords = useMemo(
  //   () =>
  //     AUDIO[internalInstrument].filter(
  //       ({ index }) => index !== lastPlayedSample?.index
  //     ),
  //   [lastPlayedSample]
  // );

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

  // useEffect(() => {
  //   if (lastPlayedSample && lastPlayedSample.sampler.loaded) {
  //     lastPlayedSample.sampler.triggerAttack(
  //       instrument === 1 ? "G#-1" : "C#-1"
  //     );
  //   }
  // }, [lastPlayedSample]);

  const [circleSprings, setCircleSprings] = useSprings(circleCount, (i) => ({
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  }));

  const onPointerDown = useCallback(async () => {
    if (!toneInitialized.current) {
      await start();
      toneInitialized.current = true;
    }

    const shuffledIndexes = sortRandom(circles.map((o, i) => i));

    setCircleSprings.start((i) => ({
      rotation: [
        0,
        0,
        pickRandomDecimalFromInterval(
          circleSprings[i].rotation.get()[2] - Math.PI,
          circleSprings[i].rotation.get()[2] + Math.PI
        ),
      ],
      scale: [
        pickRandomDecimalFromInterval(0.8, 1.2),
        pickRandomDecimalFromInterval(0.8, 1.2),
        1,
      ],
      delay: shuffledIndexes[i] * 40,
      config: {
        mass: 4,
        tension: 150,
        friction: 45,
      },
    }));

    // const currentSampler = pickRandomHash(availableChords);
    // setLastPlayedSample(currentSampler);
  }, [setCircleSprings, circleSprings]);

  useEffect(() => {
    const ref = canvasRef?.current;

    if (!ref) {
      return;
    }

    ref.addEventListener("pointerdown", onPointerDown);

    return () => {
      ref.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onPointerDown, canvasRef]);

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
        {circles.map((o, i) => (
          <Circle key={i} {...o} circleSpring={circleSprings[i]} />
        ))}
      </group>
      <mesh position={[0, 0, 7.5]} rotation={[-Math.PI, 0, 0]}>
        <planeGeometry args={[getSizeByWidthAspect(15, aspect), 15]} />
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
