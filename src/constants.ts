export const CIRCLE_ROUGHNESS = [
  ...new Array(36).fill(null).map(() => 0),
  1,
  2,
  3,
  4,
];

export const roughnessMode = [
  {
    roughness: 0.4,
    metalness: 0.8,
  },
  {
    roughness: 0.6,
    metalness: 5,
  },
  {
    roughness: 0.5,
    metalness: 3,
  },
  {
    roughness: 0.2,
    metalness: 2,
  },
  {
    roughness: 0.2,
    metalness: 8,
  },
];

export const LIGHT_COLORS = [
  "",
  "#ffffff",
  "#c06e86",
  "#0f9ebe",
  "#eb3434",
  "#ffce00",
  "#ff48e6",
  "#30f8a0",
];

export const DARK_COLORS = [
  "#000000",
  "#000080",
  "#004932",
  "#eb3434",
  "#c06e86",
  "#d54c1a",
];

export const DARK_BG_COLORS = [
  "#000080",
  "#004932",
  "#c91414",
  "#aa336a",
  "#d54c1a",
];

export const LIGHT_BG_COLORS = [
  "#ffffff",
  "#FCEEB5",
  "#fff6d1",
  "#d8ffdd",
  "#f7c8d3",
];
