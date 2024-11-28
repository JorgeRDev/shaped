var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// requirements.js
var require_requirements = __commonJS({
  "requirements.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.optionalDependencies = exports2.engines = exports2.config = void 0;
    var config2 = {
      libvips: ">=8.15.3"
    };
    exports2.config = config2;
    var engines2 = {
      node: "^18.17.0 || ^20.3.0 || >=21.0.0"
    };
    exports2.engines = engines2;
    var optionalDependencies2 = {
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
    exports2.optionalDependencies = optionalDependencies2;
  }
});

// lib/sharp.ts
var import_detect_libc2 = require("detect-libc");

// lib/libvips.ts
var import_gte = __toESM(require("semver/functions/gte"));
var import_coerce = __toESM(require("semver/functions/coerce"));
var import_satisfies = __toESM(require("semver/functions/satisfies"));
var import_detect_libc = __toESM(require("detect-libc"));
var import_requirements = __toESM(require_requirements());
var minimumLibvipsVersionLabelled = process.env.npm_package_config_libvips || import_requirements.config.libvips;
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
var runtimeLibc = () => import_detect_libc.default.isNonGlibcLinuxSync() ? import_detect_libc.default.familySync() : "";
var runtimePlatformArch = () => `${process.platform}${runtimeLibc()}-${process.arch}`;
var isUnsupportedNodeRuntime = () => {
  var _a2;
  if (((_a2 = process.release) == null ? void 0 : _a2.name) === "node" && process.versions) {
    if (!(0, import_satisfies.default)(process.versions.node, import_requirements.engines.node)) {
      return true;
    }
  }
};

// lib/sharp.ts
var runtimePlatform = runtimePlatformArch();
var paths = [
  `../src/build/Release/sharp-${runtimePlatform}.node`,
  "../src/build/Release/sharp-wasm32.node",
  `@img/sharp-${runtimePlatform}/sharp.node`,
  "@img/sharp-wasm32/sharp.node"
];
var sharp;
var errors = [];
var loadSharpModule = async () => {
  for (const path of paths) {
    try {
      sharp = await import(path);
      break;
    } catch (error) {
      errors.push(error);
    }
  }
  if (!sharp) {
    const [isLinux, isMacOs, isWindows] = ["linux", "darwin", "win32"].map(
      (os) => runtimePlatform.startsWith(os)
    );
    const help = [
      `Could not load the "sharp" module using the ${runtimePlatform} runtime`
    ];
    errors.forEach((err) => {
      if (err.code !== "MODULE_NOT_FOUND") {
        help.push(`${err.code}: ${err.message}`);
      }
    });
    const messages = errors.map((err) => err.message).join(" ");
    help.push("Possible solutions:");
    if (isUnsupportedNodeRuntime()) {
      const { found, expected } = isUnsupportedNodeRuntime();
      help.push(
        "- Please upgrade Node.js:",
        `    Found ${found}`,
        `    Requires ${expected}`
      );
    } else if (prebuiltPlatforms.includes(runtimePlatform)) {
      const [os, cpu] = runtimePlatform.split("-");
      const libc = os.endsWith("musl") ? " --libc=musl" : "";
      help.push(
        "- Ensure optional dependencies can be installed:",
        "    npm install --include=optional sharp",
        "- Ensure your package manager supports multi-platform installation:",
        "    See https://sharp.pixelplumbing.com/install#cross-platform",
        "- Add platform-specific dependencies:",
        `    npm install --os=${os.replace(
          "musl",
          ""
        )}${libc} --cpu=${cpu} sharp`
      );
    } else {
      help.push(
        `- Manually install libvips >= ${minimumLibvipsVersion}`,
        "- Add experimental WebAssembly-based dependencies:",
        "    npm install --cpu=wasm32 sharp",
        "    npm install @img/sharp-wasm32"
      );
    }
    if (isLinux && /(symbol not found|CXXABI_)/i.test(messages)) {
      try {
        const {
          config: config2
        } = require(`@img/sharp-libvips-${runtimePlatform}/package`);
        const libcFound = `${(0, import_detect_libc2.familySync)()} ${(0, import_detect_libc2.versionSync)()}`;
        const libcRequires = `${config2.musl ? "musl" : "glibc"} ${config2.musl || config2.glibc}`;
        help.push(
          "- Update your OS:",
          `    Found ${libcFound}`,
          `    Requires ${libcRequires}`
        );
      } catch (errEngines) {
      }
    }
    if (isLinux && /\/snap\/core[0-9]{2}/.test(messages)) {
      help.push(
        "- Remove the Node.js Snap, which does not support native modules",
        "    snap remove node"
      );
    }
    if (isMacOs && /Incompatible library version/.test(messages)) {
      help.push("- Update Homebrew:", "    brew update && brew upgrade vips");
    }
    if (errors.some((err) => err.code === "ERR_DLOPEN_DISABLED")) {
      help.push("- Run Node.js without using the --no-addons flag");
    }
    if (isWindows && /The specified procedure could not be found/.test(messages)) {
      help.push(
        "- Using the canvas package on Windows?",
        "    See https://sharp.pixelplumbing.com/install#canvas-and-windows",
        "- Check for outdated versions of sharp in the dependency tree:",
        "    npm ls sharp"
      );
    }
    help.push(
      "- Consult the installation documentation:",
      "    See https://sharp.pixelplumbing.com/install"
    );
    throw new Error(help.join("\n"));
  }
};
var sharp_default = loadSharpModule();

// lib/index.ts
async function processImage(options2) {
  const sharpNative = await sharp_default;
  sharpNative.pipeline(options2, (err, data, info) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Data:", data);
      console.log("Info:", info);
    }
  });
}
var options = {
  // Define tus opciones aquí
};
processImage(options).catch(console.error);
