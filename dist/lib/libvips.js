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

// lib/libvips.ts
var libvips_exports = {};
__export(libvips_exports, {
  buildPlatformArch: () => buildPlatformArch,
  buildSharpLibvipsCPlusPlusDir: () => buildSharpLibvipsCPlusPlusDir,
  buildSharpLibvipsIncludeDir: () => buildSharpLibvipsIncludeDir,
  buildSharpLibvipsLibDir: () => buildSharpLibvipsLibDir,
  globalLibvipsVersion: () => globalLibvipsVersion,
  isUnsupportedNodeRuntime: () => isUnsupportedNodeRuntime,
  log: () => log,
  minimumLibvipsVersion: () => minimumLibvipsVersion,
  pkgConfigPath: () => pkgConfigPath,
  prebuiltPlatforms: () => prebuiltPlatforms,
  runtimePlatformArch: () => runtimePlatformArch,
  spawnRebuild: () => spawnRebuild,
  useGlobalLibvips: () => useGlobalLibvips,
  yarnLocator: () => yarnLocator
});
module.exports = __toCommonJS(libvips_exports);
var import_child_process = require("child_process");
var import_crypto = require("crypto");
var import_gte = __toESM(require("semver/functions/gte"));
var import_coerce = __toESM(require("semver/functions/coerce"));
var import_satisfies = __toESM(require("semver/functions/satisfies"));
var import_detect_libc = __toESM(require("detect-libc"));

// requirements.ts
var config = {
  libvips: ">=8.15.3"
};
var engines = {
  node: "^18.17.0 || ^20.3.0 || >=21.0.0"
};
var optionalDependencies = {
  "@img/sharp-darwin-arm64": "0.33.5",
  "@img/sharp-darwin-x64": "0.33.5",
  "@img/sharp-libvips-darwin-arm64": "1.0.4",
  "@img/sharp-libvips-darwin-x64": "1.0.4",
  "@img/sharp-libvips-linux-arm": "1.0.5",
  "@img/sharp-libvips-linux-arm64": "1.0.4",
  "@img/sharp-libvips-linux-s390x": "1.0.4",
  "@img/sharp-libvips-linux-x64": "1.0.4",
  "@img/sharp-libvips-linuxmusl-arm64": "1.0.4",
  "@img/sharp-libvips-linuxmusl-x64": "1.0.4",
  "@img/sharp-linux-arm": "0.33.5",
  "@img/sharp-linux-arm64": "0.33.5",
  "@img/sharp-linux-s390x": "0.33.5",
  "@img/sharp-linux-x64": "0.33.5",
  "@img/sharp-linuxmusl-arm64": "0.33.5",
  "@img/sharp-linuxmusl-x64": "0.33.5",
  "@img/sharp-wasm32": "0.33.5",
  "@img/sharp-win32-ia32": "0.33.5",
  "@img/sharp-win32-x64": "0.33.5"
};

// lib/libvips.ts
var minimumLibvipsVersionLabelled = process.env.npm_package_config_libvips || config.libvips;
var _a;
var minimumLibvipsVersion = (_a = (0, import_coerce.default)(
  minimumLibvipsVersionLabelled
)) == null ? void 0 : _a.version;
var prebuiltPlatforms = [
  "darwin-arm64",
  "darwin-x64",
  "linux-arm",
  "linux-arm64",
  "linux-s390x",
  "linux-x64",
  "linuxmusl-arm64",
  "linuxmusl-x64",
  "win32-ia32",
  "win32-x64"
];
var spawnSyncOptions = {
  encoding: "utf8",
  shell: true
};
var log = (item) => {
  if (item instanceof Error) {
    console.error(`sharp: Installation error: ${item.message}`);
  } else {
    console.log(`sharp: ${item}`);
  }
};
var runtimeLibc = () => import_detect_libc.default.isNonGlibcLinuxSync() ? import_detect_libc.default.familySync() : "";
var runtimePlatformArch = () => `${process.platform}${runtimeLibc()}-${process.arch}`;
var buildPlatformArch = () => {
  const { npm_config_arch, npm_config_platform, npm_config_libc } = process.env;
  const libc = typeof npm_config_libc === "string" ? npm_config_libc : runtimeLibc();
  return `${npm_config_platform || process.platform}${libc}-${npm_config_arch || process.arch}`;
};
var buildSharpLibvipsIncludeDir = async () => {
  try {
    const module2 = await import(`@img/sharp-libvips-dev-${buildPlatformArch()}/include`);
    return module2;
  } catch {
    try {
      const module2 = await import("@img/sharp-libvips-dev/include");
      return module2;
    } catch {
    }
  }
};
var buildSharpLibvipsCPlusPlusDir = async () => {
  try {
    const module2 = await import("@img/sharp-libvips-dev/cplusplus");
    return module2;
  } catch {
  }
  return "";
};
var buildSharpLibvipsLibDir = async () => {
  try {
    const module2 = await import(`@img/sharp-libvips-dev-${buildPlatformArch()}/lib`);
    return module2;
  } catch {
    try {
      const module2 = await import(`@img/sharp-libvips-${buildPlatformArch()}/lib`);
    } catch {
    }
  }
  return "";
};
var isUnsupportedNodeRuntime = () => {
  var _a2;
  if (((_a2 = process.release) == null ? void 0 : _a2.name) === "node" && process.versions) {
    if (!(0, import_satisfies.default)(process.versions.node, engines.node)) {
      return true;
    }
  }
};
var isEmscripten = () => {
  const { CC } = process.env;
  return Boolean(CC && CC.endsWith("/emcc"));
};
var isRosetta = () => {
  if (process.platform === "darwin" && process.arch === "x64") {
    const translated = (0, import_child_process.spawnSync)(
      "sysctl sysctl.proc_translated",
      spawnSyncOptions
    ).stdout;
    return (translated || "").trim() === "sysctl.proc_translated: 1";
  }
  return false;
};
var sha512 = (s) => (0, import_crypto.createHash)("sha512").update(s).digest("hex");
var yarnLocator = () => {
  try {
    const identHash = sha512(`imgsharp-libvips-${buildPlatformArch()}`);
    const npmVersion = (0, import_coerce.default)(
      optionalDependencies[`@img/sharp-libvips-${buildPlatformArch()}`]
    ).version;
    return sha512(`${identHash}npm:${npmVersion}`).slice(0, 10);
  } catch {
  }
  return "";
};
var spawnRebuild = () => (0, import_child_process.spawnSync)(
  `node-gyp rebuild --directory=src ${isEmscripten() ? "--nodedir=emscripten" : ""}`,
  {
    ...spawnSyncOptions,
    stdio: "inherit"
  }
).status;
var globalLibvipsVersion = () => {
  if (process.platform !== "win32") {
    const globalLibvipsVersion2 = (0, import_child_process.spawnSync)("pkg-config --modversion vips-cpp", {
      ...spawnSyncOptions,
      env: {
        ...process.env,
        PKG_CONFIG_PATH: pkgConfigPath()
      }
    }).stdout;
    return (globalLibvipsVersion2 || "").trim();
  } else {
    return "";
  }
};
var pkgConfigPath = () => {
  if (process.platform !== "win32") {
    const brewPkgConfigPath = (0, import_child_process.spawnSync)(
      'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
      spawnSyncOptions
    ).stdout || "";
    return [
      brewPkgConfigPath.trim(),
      process.env.PKG_CONFIG_PATH,
      "/usr/local/lib/pkgconfig",
      "/usr/lib/pkgconfig",
      "/usr/local/libdata/pkgconfig",
      "/usr/libdata/pkgconfig"
    ].filter(Boolean).join(":");
  } else {
    return "";
  }
};
var skipSearch = (status, reason, logger) => {
  if (logger) {
    logger(
      `Detected ${reason}, skipping search for globally-installed libvips`
    );
  }
  return status;
};
var useGlobalLibvips = (logger) => {
  if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
    return skipSearch(false, "SHARP_IGNORE_GLOBAL_LIBVIPS", logger);
  }
  if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === true) {
    return skipSearch(true, "SHARP_FORCE_GLOBAL_LIBVIPS", logger);
  }
  if (isRosetta()) {
    return skipSearch(false, "Rosetta", logger);
  }
  const globalVipsVersion = globalLibvipsVersion();
  return !!globalVipsVersion && (0, import_gte.default)(globalVipsVersion, minimumLibvipsVersion);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildPlatformArch,
  buildSharpLibvipsCPlusPlusDir,
  buildSharpLibvipsIncludeDir,
  buildSharpLibvipsLibDir,
  globalLibvipsVersion,
  isUnsupportedNodeRuntime,
  log,
  minimumLibvipsVersion,
  pkgConfigPath,
  prebuiltPlatforms,
  runtimePlatformArch,
  spawnRebuild,
  useGlobalLibvips,
  yarnLocator
});
