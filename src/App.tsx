import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene, { pitch } from "./Scene";
import { Sampler } from "tone";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 14px; background-color: #000000;"
);

console.log(
  "%c http://www.computeremotions.com ",
  "font-size: 12px; background-color: #000000;"
);

export interface Sample {
  index: number;
  pluckIndex?: number;
  sampler: Sampler;
}

const pitchPath = pitch === 0 ? "high-pitch" : "low-pitch";
const baseUrlChords = `${process.env.PUBLIC_URL}/audio/${pitchPath}/chords/`;
const baseUrlPlucks = `${process.env.PUBLIC_URL}/audio/${pitchPath}/plucks/`;

export const PLUCKS: Sample[] = [
  {
    index: 0,
    sampler: new Sampler({
      urls: {
        1: "pluck-g4.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: "pluck-c4.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: "pluck-fs4.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: "pluck-d4.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: "pluck-d42.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
  {
    index: 5,
    sampler: new Sampler({
      urls: {
        1: "pluck-e4.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
  {
    index: 6,
    sampler: new Sampler({
      urls: {
        1: "pluck-e42.mp3",
      },
      baseUrl: baseUrlPlucks,
    }),
  },
];

export const CHORDS: Sample[] = [
  {
    index: 0,
    pluckIndex: 1,
    sampler: new Sampler({
      urls: {
        1: "c4.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
  {
    index: 1,
    pluckIndex: 3,
    sampler: new Sampler({
      urls: {
        1: "d4.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
  {
    index: 2,
    pluckIndex: 4,
    sampler: new Sampler({
      urls: {
        1: "d42.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
  {
    index: 3,
    pluckIndex: 5,
    sampler: new Sampler({
      urls: {
        1: "e4.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
  {
    index: 4,
    pluckIndex: 6,
    sampler: new Sampler({
      urls: {
        1: "e42.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
  {
    index: 5,
    pluckIndex: 2,
    sampler: new Sampler({
      urls: {
        1: "fs4.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
  {
    index: 6,
    pluckIndex: 0,
    sampler: new Sampler({
      urls: {
        1: "g4.mp3",
      },
      baseUrl: baseUrlChords,
    }),
  },
];

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, -2] }}
      shadows
      dpr={window.devicePixelRatio}
    >
      <Suspense fallback={null}>
        <Scene canvasRef={canvasRef} />
      </Suspense>
    </Canvas>
  );
};

export default App;
