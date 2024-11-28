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

// lib/contructor.ts
var contructor_exports = {};
__export(contructor_exports, {
  default: () => contructor_default
});
module.exports = __toCommonJS(contructor_exports);
var import_stream = require("stream");

// lib/resize.ts
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

// lib/contructor.ts
var Sharp = class _Sharp extends import_stream.Duplex {
  input;
  options;
  constructor(input, options) {
    if (!input) {
      throw new Error("Invalid input");
    }
    super();
    if (!(this instanceof _Sharp)) {
      return new _Sharp(input, options);
    }
  }
  resize(width, height, options) {
    return new resize_default(this, width, height, options);
  }
  /**
   * Take a "snapshot" of the Sharp instance, returning a new instance.
   * Cloned instances inherit the input of their parent instance.
   * This allows multiple output Streams and therefore multiple processing pipelines to share a single input Stream.
   *
   * @example
   * const pipeline = sharp().rotate();
   * pipeline.clone().resize(800, 600).pipe(firstWritableStream);
   * pipeline.clone().extract({ left: 20, top: 20, width: 100, height: 100 }).pipe(secondWritableStream);
   * readableStream.pipe(pipeline);
   * // firstWritableStream receives auto-rotated, resized readableStream
   * // secondWritableStream receives auto-rotated, extracted region of readableStream
   *
   * @example
   * // Create a pipeline that will download an image, resize it and format it to different files
   * // Using Promises to know when the pipeline is complete
   * const fs = require("fs");
   * const got = require("got");
   * const sharpStream = sharp({ failOn: 'none' });
   *
   * const promises = [];
   *
   * promises.push(
   *   sharpStream
   *     .clone()
   *     .jpeg({ quality: 100 })
   *     .toFile("originalFile.jpg")
   * );
   *
   * promises.push(
   *   sharpStream
   *     .clone()
   *     .resize({ width: 500 })
   *     .jpeg({ quality: 80 })
   *     .toFile("optimized-500.jpg")
   * );
   *
   * promises.push(
   *   sharpStream
   *     .clone()
   *     .resize({ width: 500 })
   *     .webp({ quality: 80 })
   *     .toFile("optimized-500.webp")
   * );
   *
   * // https://github.com/sindresorhus/got/blob/main/documentation/3-streams.md
   * got.stream("https://www.example.com/some-file.jpg").pipe(sharpStream);
   *
   * Promise.all(promises)
   *   .then(res => { console.log("Done!", res); })
   *   .catch(err => {
   *     console.error("Error processing files, let's clean it up", err);
   *     try {
   *       fs.unlinkSync("originalFile.jpg");
   *       fs.unlinkSync("optimized-500.jpg");
   *       fs.unlinkSync("optimized-500.webp");
   *     } catch (e) {}
   *   });
   *
   * @returns {Sharp}
   */
  clone() {
    const Constructor = this.constructor;
    return new Constructor(this.input, this.options);
  }
};
var sharp = new Sharp("input", { width: 100, height: 100 }).resize(200);
var contructor_default = Sharp;
