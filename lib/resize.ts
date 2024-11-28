import Sharp from "./contructor";
import Options from "../interfaces/SharpOptions";

/**
 * Resize image to `width`, `height` or `width x height`.
 *
 * When both a `width` and `height` are provided, the possible methods by which the image should **fit** these are:
 * - `cover`: (default) Preserving aspect ratio, attempt to ensure the image covers both provided dimensions by cropping/clipping to fit.
 * - `contain`: Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
 * - `fill`: Ignore the aspect ratio of the input and stretch to both provided dimensions.
 * - `inside`: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
 * - `outside`: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
 *
 * Some of these values are based on the [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property.
 *
 * <img alt="Examples of various values for the fit property when resizing" width="100%" style="aspect-ratio: 998/243" src="https://cdn.jsdelivr.net/gh/lovell/sharp@main/docs/image/api-resize-fit.svg">
 *
 * When using a **fit** of `cover` or `contain`, the default **position** is `centre`. Other options are:
 * - `sharp.position`: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`.
 * - `sharp.gravity`: `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center` or `centre`.
 * - `sharp.strategy`: `cover` only, dynamically crop using either the `entropy` or `attention` strategy.
 *
 * Some of these values are based on the [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) CSS property.
 *
 * The strategy-based approach initially resizes so one dimension is at its target length
 * then repeatedly ranks edge regions, discarding the edge with the lowest score based on the selected strategy.
 * - `entropy`: focus on the region with the highest [Shannon entropy](https://en.wikipedia.org/wiki/Entropy_%28information_theory%29).
 * - `attention`: focus on the region with the highest luminance frequency, colour saturation and presence of skin tones.
 *
 * Possible downsizing kernels are:
 * - `nearest`: Use [nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation).
 * - `linear`: Use a [triangle filter](https://en.wikipedia.org/wiki/Triangular_function).
 * - `cubic`: Use a [Catmull-Rom spline](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline).
 * - `mitchell`: Use a [Mitchell-Netravali spline](https://www.cs.utexas.edu/~fussell/courses/cs384g-fall2013/lectures/mitchell/Mitchell.pdf).
 * - `lanczos2`: Use a [Lanczos kernel](https://en.wikipedia.org/wiki/Lanczos_resampling#Lanczos_kernel) with `a=2`.
 * - `lanczos3`: Use a Lanczos kernel with `a=3` (the default).
 *
 * When upsampling, these kernels map to `nearest`, `linear` and `cubic` interpolators.
 * Downsampling kernels without a matching upsampling interpolator map to `cubic`.
 *
 * Only one resize can occur per pipeline.
 * Previous calls to `resize` in the same pipeline will be ignored.
 *
 * @example
 * sharp(input)
 *   .resize({ width: 100 })
 *   .toBuffer()
 *   .then(data => {
 *     // 100 pixels wide, auto-scaled height
 *   });
 *
 * @example
 * sharp(input)
 *   .resize({ height: 100 })
 *   .toBuffer()
 *   .then(data => {
 *     // 100 pixels high, auto-scaled width
 *   });
 *
 * @example
 * sharp(input)
 *   .resize(200, 300, {
 *     kernel: sharp.kernel.nearest,
 *     fit: 'contain',
 *     position: 'right top',
 *     background: { r: 255, g: 255, b: 255, alpha: 0.5 }
 *   })
 *   .toFile('output.png')
 *   .then(() => {
 *     // output.png is a 200 pixels wide and 300 pixels high image
 *     // containing a nearest-neighbour scaled version
 *     // contained within the north-east corner of a semi-transparent white canvas
 *   });
 *
 * @example
 * const transformer = sharp()
 *   .resize({
 *     width: 200,
 *     height: 200,
 *     fit: sharp.fit.cover,
 *     position: sharp.strategy.entropy
 *   });
 * // Read image data from readableStream
 * // Write 200px square auto-cropped image data to writableStream
 * readableStream
 *   .pipe(transformer)
 *   .pipe(writableStream);
 *
 * @example
 * sharp(input)
 *   .resize(200, 200, {
 *     fit: sharp.fit.inside,
 *     withoutEnlargement: true
 *   })
 *   .toFormat('jpeg')
 *   .toBuffer()
 *   .then(function(outputBuffer) {
 *     // outputBuffer contains JPEG image data
 *     // no wider and no higher than 200 pixels
 *     // and no larger than the input image
 *   });
 *
 * @example
 * sharp(input)
 *   .resize(200, 200, {
 *     fit: sharp.fit.outside,
 *     withoutReduction: true
 *   })
 *   .toFormat('jpeg')
 *   .toBuffer()
 *   .then(function(outputBuffer) {
 *     // outputBuffer contains JPEG image data
 *     // of at least 200 pixels wide and 200 pixels high while maintaining aspect ratio
 *     // and no smaller than the input image
 *   });
 *
 * @example
 * const scaleByHalf = await sharp(input)
 *   .metadata()
 *   .then(({ width }) => sharp(input)
 *     .resize(Math.round(width * 0.5))
 *     .toBuffer()
 *   );
 *
 * @param {number} [width] - How many pixels wide the resultant image should be. Use `null` or `undefined` to auto-scale the width to match the height.
 * @param {number} [height] - How many pixels high the resultant image should be. Use `null` or `undefined` to auto-scale the height to match the width.
 * @param {Object} [options]
 * @param {number} [options.width] - An alternative means of specifying `width`. If both are present this takes priority.
 * @param {number} [options.height] - An alternative means of specifying `height`. If both are present this takes priority.
 * @param {String} [options.fit='cover'] - How the image should be resized/cropped to fit the target dimension(s), one of `cover`, `contain`, `fill`, `inside` or `outside`.
 * @param {String} [options.position='centre'] - A position, gravity or strategy to use when `fit` is `cover` or `contain`.
 * @param {String|Object} [options.background={r: 0, g: 0, b: 0, alpha: 1}] - background colour when `fit` is `contain`, parsed by the [color](https://www.npmjs.org/package/color) module, defaults to black without transparency.
 * @param {String} [options.kernel='lanczos3'] - The kernel to use for image reduction and the inferred interpolator to use for upsampling. Use the `fastShrinkOnLoad` option to control kernel vs shrink-on-load.
 * @param {Boolean} [options.withoutEnlargement=false] - Do not scale up if the width *or* height are already less than the target dimensions, equivalent to GraphicsMagick's `>` geometry option. This may result in output dimensions smaller than the target dimensions.
 * @param {Boolean} [options.withoutReduction=false] - Do not scale down if the width *or* height are already greater than the target dimensions, equivalent to GraphicsMagick's `<` geometry option. This may still result in a crop to reach the target dimensions.
 * @param {Boolean} [options.fastShrinkOnLoad=true] - Take greater advantage of the JPEG and WebP shrink-on-load feature, which can lead to a slight moiré pattern or round-down of an auto-scaled dimension.
 * @returns {Sharp}
 * @throws {Error} Invalid parameters
 */

class Resize {
  options: Options;

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
    northwest: 8,
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
    "left top": 8,
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
    mirror: "mirror",
  };

  /**
   * Strategies for automagic cover behaviour.
   * @member
   * @private
   */
  #strategy = {
    entropy: 16,
    attention: 17,
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
    lanczos3: "lanczos3",
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
    outside: "outside",
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
    outside: "min",
  };

  /**
   * @private
   */
  #isRotationExpected(options) {
    return (
      options.angle % 360 !== 0 ||
      options.useExifOrientation === true ||
      options.rotationAngle !== 0
    );
  }

  /**
   * @private
   */
  #isResizeExpected(options) {
    return options.width !== -1 || options.height !== -1;
  }

  constructor(
    private sharpInstance: Sharp,
    widthOrOptions: number | Options,
    height?: number,
    options?: Options
  ) {
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
}

export default Resize;
