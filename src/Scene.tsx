import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { start } from "tone";
import {
  getSizeByAspect,
  getSizeByWidthAspect,
  minMaxNumber,
  pickRandomBoolean,
  pickRandomColorWithTheme,
  pickRandomDecimalFromInterval,
  pickRandomHash,
  pickRandomIntFromInterval,
  range,
  sortRandom,
} from "./utils";
import { useSprings } from "@react-spring/three";
import { SpotLight, AmbientLight } from "three";
import Circle, { CircleProps } from "./Circle";
import {
  CIRCLE_ROUGHNESS,
  DARK_BG_COLORS,
  DARK_COLORS,
  LIGHT_BG_COLORS,
  LIGHT_COLORS,
} from "./constants";
import OuterCircle, { OuterCircleProps } from "./OuterCircle";
import { CHORDS, PLUCKS, Sample } from "./App";

export const getSpotlightAngle = (aspect: number, circleRoughness: number) =>
  circleRoughness === 4
    ? minMaxNumber(
        aspect > 1 ? 0.15 : range(0.5, 2, 0.01, 0.15, aspect),
        0.01,
        0.15
      )
    : circleRoughness === 3
    ? minMaxNumber(
        aspect > 1 ? 0.15 : range(0.3, 1.5, 0.01, 0.15, aspect),
        0.01,
        0.15
      )
    : circleRoughness === 2
    ? minMaxNumber(
        aspect > 1 ? 0.15 : range(0.3, 1, 0.01, 0.15, aspect),
        0.01,
        0.15
      )
    : minMaxNumber(
        aspect > 1 ? 0.15 : range(0.3, 1, 0.01, 0.15, aspect),
        0.01,
        0.15
      );

export const getSpotlightPosY = (aspect: number) =>
  minMaxNumber(aspect > 1 ? 15 : range(0.3, 1, 10, 15, aspect), 10, 15);

const outerCircleCount = pickRandomIntFromInterval(10, 15);
export const circleRoughness = pickRandomHash(CIRCLE_ROUGHNESS);
const circleCount = pickRandomIntFromInterval(20, 30);
const circleWireframe = pickRandomBoolean();
const circleInnerRadius = pickRandomHash([
  ...new Array(1).fill(null).map(() => 0.2),
  ...new Array(4).fill(null).map(() => 0.3),
  ...new Array(1).fill(null).map(() => 0.4),
]);

const bgTheme = pickRandomHash([0, 1]);
const bgColor = pickRandomHash(
  bgTheme === 0 ? LIGHT_BG_COLORS : DARK_BG_COLORS
);
const primaryTheme = bgTheme === 0 ? DARK_COLORS : LIGHT_COLORS;
const primaryColor = pickRandomHash(primaryTheme);

export const ringSegments = circleWireframe
  ? pickRandomHash([64, 64, 64, 32])
  : 64;

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
  thetaStart: pickRandomDecimalFromInterval(0, Math.PI * 2),
  thetaLength: pickRandomDecimalFromInterval(Math.PI / 3.5, Math.PI / 1.5),
  wireframe: circleWireframe,
  circleInnerRadius,
  emissiveIntensity: pickRandomDecimalFromInterval(0.2, 0.5),
  color: pickRandomColorWithTheme(primaryColor, primaryTheme, 10),
  zPos: 1 - i / 8,
  distortSpeed: pickRandomDecimalFromInterval(0.1, 1.5),
}));

const outerCircles = new Array(outerCircleCount)
  .fill(null)
  .map<OuterCircleProps>((o, i) => ({
    radius: pickRandomDecimalFromInterval(5, 6),
    thetaStart: pickRandomDecimalFromInterval(0, Math.PI * 2),
    thetaLength: pickRandomDecimalFromInterval(Math.PI / 2, Math.PI / 1.5),
    wireframe: circleWireframe,
    circleInnerRadius: pickRandomDecimalFromInterval(3, 4),
    emissiveIntensity: pickRandomDecimalFromInterval(0.1, 1),
    color: pickRandomColorWithTheme(primaryColor, primaryTheme, 10),
    zPos: 1 - i / 3,
    distortSpeed: pickRandomDecimalFromInterval(0.1, 0.5),
  }));

const Scene = ({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) => {
  const toneInitialized = useRef(false);
  const { aspect } = useThree((state) => ({
    aspect: state.viewport.aspect,
  }));

  const [lastPlayedSample, setLastPlayedSample] = useState<Sample>();
  const availableChords = useMemo(
    () => CHORDS.filter(({ index }) => index !== lastPlayedSample?.index),
    [lastPlayedSample]
  );

  useEffect(() => {
    if (lastPlayedSample && lastPlayedSample.sampler.loaded) {
      lastPlayedSample.sampler.triggerAttack("C#-1");
    }
  }, [lastPlayedSample]);

  const ambientRef = useRef<AmbientLight>();
  const mainLightRef = useRef<SpotLight>();
  const centerLightRef = useRef<SpotLight>();

  useEffect(() => {
    mainLightRef.current?.target.position.set(0, 0, 7.5);
    mainLightRef.current?.target.updateMatrixWorld();
    centerLightRef.current?.target.position.set(0, 0, 7.5);
    centerLightRef.current?.target.updateMatrixWorld();
  }, []);

  const [outerCircleSprings, setOuterCircleSprings] = useSprings(
    outerCircleCount,
    (i) => ({
      opacity: 0.01,
      scale: [1, 1, 1],
    })
  );

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
    const shuffledOuterIndexes = sortRandom(outerCircles.map((o, i) => i));

    setOuterCircleSprings.start((i) => ({
      opacity: circleWireframe ? 0.1 : 0.05,
      scale: [0.9, 0.9, 0.9],
      delay: shuffledOuterIndexes[i] * 40,
      config: {
        mass: 4,
        tension: 50,
        friction: 45,
      },
    }));

    setCircleSprings.start((i) => ({
      scale: [0.5, 0.5, 0.5],
      delay: shuffledIndexes[i] * 10,
      config: {
        mass: 1,
        tension: 500,
        friction: 45,
      },
    }));

    const currentSampler = pickRandomHash(availableChords);
    setLastPlayedSample(currentSampler);
  }, [setCircleSprings, setOuterCircleSprings, availableChords]);

  const onPointerUp = useCallback(() => {
    const shuffledIndexes = sortRandom(circles.map((o, i) => i));

    setOuterCircleSprings.start((i) => ({
      opacity: 0.01,
      scale: [1, 1, 1],
      config: {
        mass: 4,
        tension: 300,
        friction: 45,
        clamp: true,
      },
    }));

    setCircleSprings.start((i) => ({
      scale: [
        pickRandomDecimalFromInterval(0.8, 1.2),
        pickRandomDecimalFromInterval(0.8, 1.2),
        1,
      ],

      delay: 40 + shuffledIndexes[i] * 40,
      config: {
        mass: 4,
        tension: 300,
        friction: 45,
      },
    }));

    setCircleSprings.start((i) => ({
      rotation: [
        0,
        0,
        pickRandomDecimalFromInterval(
          circleSprings[i].rotation.get()[2] - Math.PI / 2,
          circleSprings[i].rotation.get()[2] + Math.PI / 2
        ),
      ],
      delay: 40 + shuffledIndexes[i] * 40,
      config: {
        mass: 4,
        tension: 200,
        friction: 45,
      },
    }));

    PLUCKS.forEach((o) => o.sampler.triggerRelease("C#-1"));
    setTimeout(() => {
      PLUCKS[lastPlayedSample?.pluckIndex || 0].sampler.triggerAttack("C#-1");
    }, 100);
  }, [
    circleSprings,
    setCircleSprings,
    setOuterCircleSprings,
    lastPlayedSample,
  ]);

  useEffect(() => {
    CHORDS.forEach(({ sampler }) => sampler.toDestination());
    PLUCKS.forEach(({ sampler }) => sampler.toDestination());
  }, []);

  useEffect(() => {
    const ref = canvasRef?.current;

    if (!ref) {
      return;
    }

    ref.addEventListener("pointerdown", onPointerDown);
    ref.addEventListener("pointerup", onPointerUp);

    return () => {
      ref.removeEventListener("pointerdown", onPointerDown);
      ref.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerDown, onPointerUp, canvasRef]);

  return (
    <>
      <OrbitControls enabled={false} />
      <ambientLight ref={ambientRef} intensity={0.2} />
      <spotLight
        ref={mainLightRef}
        position={[0, getSpotlightPosY(aspect), -7.5]}
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
        angle={getSpotlightAngle(aspect, circleRoughness)}
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
        {outerCircles.map((o, i) => (
          <OuterCircle
            key={i}
            {...o}
            outerCircleSpring={outerCircleSprings[i]}
          />
        ))}
      </group>
      <mesh position={[0, 0, 7.5]} rotation={[-Math.PI, 0, 0]}>
        <planeGeometry args={[getSizeByWidthAspect(15, aspect), 15]} />
        <meshStandardMaterial color={bgColor} />
      </mesh>
    </>
  );
};

export default Scene;
