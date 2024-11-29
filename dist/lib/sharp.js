var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/sharp.ts
var sharp_exports = {};
__export(sharp_exports, {
  default: () => sharp_default
});
module.exports = __toCommonJS(sharp_exports);
var import_os = require("os");
var import_node_path = __toESM(require("path"));

// lib/libvips.ts
var import_gte = __toESM(require("semver/functions/gte"));
var import_coerce = __toESM(require("semver/functions/coerce"));
var import_satisfies = __toESM(require("semver/functions/satisfies"));
var import_detect_libc = __toESM(require("detect-libc"));

// requirements.ts
var config = {
  libvips: ">=8.15.3"
};

// lib/libvips.ts
var minimumLibvipsVersionLabelled = process.env.npm_package_config_libvips || config.libvips;
var _a;
var minimumLibvipsVersion = (_a = (0, import_coerce.default)(
  minimumLibvipsVersionLabelled
)) == null ? void 0 : _a.version;
var runtimeLibc = () => import_detect_libc.default.isNonGlibcLinuxSync() ? import_detect_libc.default.familySync() : "";
var runtimePlatformArch = () => `${process.platform}${runtimeLibc()}-${process.arch}`;

// lib/sharp.ts
var runtimePlatform = runtimePlatformArch();
var paths = [
  //   `../src/build/Release/sharp-${runtimePlatform}.node`,
  // "../src/build/Release/sharp-wasm32.node",
  `node_modules/@img/sharp-${runtimePlatform}/lib/sharp-${runtimePlatform}.node`
  // "@img/sharp-wasm32/sharp.node",
];
var sharp;
var errors = [];
var sharpNative = { exports: {} };
var pathSharp = `node_modules/@img/sharp-${runtimePlatform}/lib/sharp-${runtimePlatform}.node`;
process.dlopen(
  sharpNative,
  import_node_path.default.join(process.cwd(), pathSharp),
  import_os.constants.dlopen.RTLD_LAZY
);
if (!sharpNative) {
  const errorMessages = errors.map((err) => err.message).join(" ");
  throw new Error(`${sharp.exports}
${errorMessages}`);
}
var sharp_default = sharpNative;
