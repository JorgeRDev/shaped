var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/resize.ts
var resize_exports = {};
__export(resize_exports, {
  default: () => resize_default
});
module.exports = __toCommonJS(resize_exports);
var Resize = class {
  constructor(sharpInstance, widthOrOptions, height, options) {
    this.sharpInstance = sharpInstance;
    this.options = options || {};
    if (widthOrOptions) {
      if (typeof widthOrOptions === "object") {
        this.options = widthOrOptions;
      } else {
        this.options.width = widthOrOptions;
        if (height) {
          this.options.height = height;
        } else {
          this.options.height = widthOrOptions;
        }
      }
    }
    if (!this.options.width) {
      throw new Error("Invalid width");
    }
    if (!this.options.height) {
      throw new Error("Invalid height");
    }
    if (this.options.width <= 0) {
      throw new Error("Width must be a positive integer and greater than 0");
    }
    if (this.options.height <= 0) {
      throw new Error("Width must be a positive integer and greater than 0");
    }
    if (options.fit) {
      if (!this.#fit[options.fit]) {
        throw new Error("Invalid fit");
      }
      const canvas = this.#mapFitToCanvas[options.fit];
      if (canvas) {
        this.options.canvas = canvas;
      }
      this.options.fit = options.fit;
    }
    Object.assign(this.sharpInstance.options, this.options);
  }
  options;
  /**
   * Weighting to apply when using contain/cover fit.
   * @member
   * @private
   */
  #gravity = {
    center: 0,
    centre: 0,
    north: 1,
    east: 2,
    south: 3,
    west: 4,
    northeast: 5,
    southeast: 6,
    southwest: 7,
    northwest: 8
  };
  /**
   * Position to apply when using contain/cover fit.
   * @member
   * @private
   */
  #position = {
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
    "right top": 5,
    "right bottom": 6,
    "left bottom": 7,
    "left top": 8
  };
  /**
   * How to extend the image.
   * @member
   * @private
   */
  #extendWith = {
    background: "background",
    copy: "copy",
    repeat: "repeat",
    mirror: "mirror"
  };
  /**
   * Strategies for automagic cover behaviour.
   * @member
   * @private
   */
  #strategy = {
    entropy: 16,
    attention: 17
  };
  /**
   * Reduction kernels.
   * @member
   * @private
   */
  #kernel = {
    nearest: "nearest",
    linear: "linear",
    cubic: "cubic",
    mitchell: "mitchell",
    lanczos2: "lanczos2",
    lanczos3: "lanczos3"
  };
  /**
   * Methods by which an image can be resized to fit the provided dimensions.
   * @member
   * @private
   */
  #fit = {
    contain: "contain",
    cover: "cover",
    fill: "fill",
    inside: "inside",
    outside: "outside"
  };
  /**
   * Map external fit property to internal canvas property.
   * @member
   * @private
   */
  #mapFitToCanvas = {
    contain: "embed",
    cover: "crop",
    fill: "ignore_aspect",
    inside: "max",
    outside: "min"
  };
  /**
   * @private
   */
  #isRotationExpected(options) {
    return options.angle % 360 !== 0 || options.useExifOrientation === true || options.rotationAngle !== 0;
  }
  /**
   * @private
   */
  #isResizeExpected(options) {
    return options.width !== -1 || options.height !== -1;
  }
};
var resize_default = Resize;
