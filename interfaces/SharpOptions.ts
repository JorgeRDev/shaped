export default interface Options {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  position?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "right top"
    | "right bottom"
    | "left bottom"
    | "left top";
  background?: { r: number; g: number; b: number; alpha: number };
  kernel?:
    | "nearest"
    | "linear"
    | "cubic"
    | "mitchell"
    | "lanczos2"
    | "lanczos3";
  withoutEnlargement?: boolean;
  withoutReduction?: boolean;
  fastShrinkOnLoad?: boolean;
}
