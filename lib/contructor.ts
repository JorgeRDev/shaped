import { Duplex } from "stream";
import Resize from "./resize";
import Options from "../interfaces/SharpOptions";

import loadSharpModule from "./sharp";

interface SharpConstructor {
  new (input: SharpInput, options?: Options): Sharp;
}

type SharpInput =
  | Buffer
  | ArrayBuffer
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | string;

class Sharp extends Duplex {
  input: SharpInput;
  options: Options;

  constructor(input: SharpInput, options) {
    if (!input) {
      throw new Error("Invalid input");
    }

    super();

    if (!(this instanceof Sharp)) {
      return new Sharp(input, options);
    }
  }

  resize(width: number, height?: number, options?: Options): Resize {
    return new Resize(this, width, height, options);
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
    const Constructor = this.constructor as SharpConstructor;

    return new Constructor(this.input, this.options);
  }
}

const sharp = new Sharp("input", { width: 100, height: 100 }).resize(200);

export default Sharp;
