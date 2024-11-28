import { spawnSync } from "child_process";
import { createHash } from "crypto";
import semverGreaterThanOrEqualTo from "semver/functions/gte";
import semverCoerce from "semver/functions/coerce";
import semverSatisfies from "semver/functions/satisfies";
import detectLibc from "detect-libc";

import { config, engines, optionalDependencies } from "../requirements.js";

const minimumLibvipsVersionLabelled =
  process.env.npm_package_config_libvips || config.libvips;

const minimumLibvipsVersion = semverCoerce(
  minimumLibvipsVersionLabelled
)?.version;

const prebuiltPlatforms = [
  "darwin-arm64",
  "darwin-x64",
  "linux-arm",
  "linux-arm64",
  "linux-s390x",
  "linux-x64",
  "linuxmusl-arm64",
  "linuxmusl-x64",
  "win32-ia32",
  "win32-x64",
];

const spawnSyncOptions = {
  encoding: "utf8",
  shell: true,
};

const log = (item) => {
  if (item instanceof Error) {
    console.error(`sharp: Installation error: ${item.message}`);
  } else {
    console.log(`sharp: ${item}`);
  }
};

/**
 * Determines the runtime C library being used on a Linux system.
 *
 * This function checks if the current Linux system is using a non-Glibc
 * C library. If it is, it returns the family name of the C library.
 * Otherwise, it returns an empty string.
 *
 * @returns {string} The family name of the non-Glibc C library if detected, otherwise an empty string.
 */
const runtimeLibc = () =>
  detectLibc.isNonGlibcLinuxSync() ? detectLibc.familySync() : "";

/**
 * Generates a string representing the current runtime platform, libc version, and architecture.
 *
 * The format of the returned string is `${platform}${libc}-${arch}`, where:
 * - `platform` is the operating system platform (e.g., 'win32', 'linux', 'darwin').
 * - `libc` is the version of the C standard library in use (e.g., 'glibc', 'musl').
 * - `arch` is the CPU architecture (e.g., 'x64', 'arm64').
 *
 * @returns {string} A string representing the current runtime platform, libc version, and architecture.
 */

/**
 * Constructs a string representing the runtime platform and architecture.
 *
 * The format of the returned string is `${process.platform}${runtimeLibc()}-${process.arch}`,
 * where `process.platform` is the operating system platform, `runtimeLibc()` is a function
 * that returns the C library used by the runtime, and `process.arch` is the processor architecture.
 *
 * @returns {string} A string representing the runtime platform and architecture.
 */
const runtimePlatformArch = () =>
  `${process.platform}${runtimeLibc()}-${process.arch}`;

/**
 * Constructs a string representing the platform, libc, and architecture
 * based on environment variables or runtime values.
 *
 * @returns {string} A string in the format `${platform}${libc}-${arch}` where:
 * - `platform` is derived from the `npm_config_platform` environment variable or `process.platform`.
 * - `libc` is derived from the `npm_config_libc` environment variable or the `runtimeLibc()` function.
 * - `arch` is derived from the `npm_config_arch` environment variable or `process.arch`.
 */
const buildPlatformArch = () => {
  const { npm_config_arch, npm_config_platform, npm_config_libc } = process.env;
  const libc =
    typeof npm_config_libc === "string" ? npm_config_libc : runtimeLibc();
  return `${npm_config_platform || process.platform}${libc}-${
    npm_config_arch || process.arch
  }`;
};

const buildSharpLibvipsIncludeDir = async () => {
  try {
    const module = await import(
      `@img/sharp-libvips-dev-${buildPlatformArch()}/include`
    );
    return module;
  } catch {
    try {
      const module = await import("@img/sharp-libvips-dev/include");
      return module;
    } catch {}
  }
};

const buildSharpLibvipsCPlusPlusDir = async () => {
  try {
    const module = await import("@img/sharp-libvips-dev/cplusplus");
    return module;
  } catch {}
  return "";
};

const buildSharpLibvipsLibDir = async () => {
  try {
    const module = await import(
      `@img/sharp-libvips-dev-${buildPlatformArch()}/lib`
    );
    return module;
  } catch {
    try {
      const module = await import(
        `@img/sharp-libvips-${buildPlatformArch()}/lib`
      );
    } catch {}
  }

  return "";
};

/**
 * Checks if the current Node.js runtime version is unsupported.
 *
 * This function verifies if the current Node.js runtime version satisfies the
 * version requirements specified in the `engines.node` field. If the runtime
 * version does not meet the requirements, the function returns `true`.
 *
 * @returns {boolean} `true` if the current Node.js runtime version is unsupported, otherwise `false`.
 */
const isUnsupportedNodeRuntime = () => {
  if (process.release?.name === "node" && process.versions) {
    if (!semverSatisfies(process.versions.node, engines.node)) {
      return true;
    }
  }
};

const isEmscripten = () => {
  const { CC } = process.env;
  return Boolean(CC && CC.endsWith("/emcc"));
};

const isRosetta = () => {
  /* istanbul ignore next */
  if (process.platform === "darwin" && process.arch === "x64") {
    const translated = spawnSync(
      "sysctl sysctl.proc_translated",
      spawnSyncOptions
    ).stdout;
    return (translated || "").trim() === "sysctl.proc_translated: 1";
  }
  return false;
};

const sha512 = (s) => createHash("sha512").update(s).digest("hex");

const yarnLocator = () => {
  try {
    const identHash = sha512(`imgsharp-libvips-${buildPlatformArch()}`);
    const npmVersion = semverCoerce(
      optionalDependencies[`@img/sharp-libvips-${buildPlatformArch()}`]
    ).version;
    return sha512(`${identHash}npm:${npmVersion}`).slice(0, 10);
  } catch {}
  return "";
};

const spawnRebuild = () =>
  spawnSync(
    `node-gyp rebuild --directory=src ${
      isEmscripten() ? "--nodedir=emscripten" : ""
    }`,
    {
      ...spawnSyncOptions,
      stdio: "inherit",
    }
  ).status;

const globalLibvipsVersion = () => {
  if (process.platform !== "win32") {
    const globalLibvipsVersion = spawnSync("pkg-config --modversion vips-cpp", {
      ...spawnSyncOptions,
      env: {
        ...process.env,
        PKG_CONFIG_PATH: pkgConfigPath(),
      },
    }).stdout;
    /* istanbul ignore next */
    return (globalLibvipsVersion || "").trim();
  } else {
    return "";
  }
};

/* istanbul ignore next */
const pkgConfigPath = () => {
  if (process.platform !== "win32") {
    const brewPkgConfigPath =
      spawnSync(
        'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
        spawnSyncOptions
      ).stdout || "";
    return [
      brewPkgConfigPath.trim(),
      process.env.PKG_CONFIG_PATH,
      "/usr/local/lib/pkgconfig",
      "/usr/lib/pkgconfig",
      "/usr/local/libdata/pkgconfig",
      "/usr/libdata/pkgconfig",
    ]
      .filter(Boolean)
      .join(":");
  } else {
    return "";
  }
};

const skipSearch = (status, reason, logger) => {
  if (logger) {
    logger(
      `Detected ${reason}, skipping search for globally-installed libvips`
    );
  }
  return status;
};

const useGlobalLibvips = (logger) => {
  if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
    return skipSearch(false, "SHARP_IGNORE_GLOBAL_LIBVIPS", logger);
  }
  if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === true) {
    return skipSearch(true, "SHARP_FORCE_GLOBAL_LIBVIPS", logger);
  }
  /* istanbul ignore next */
  if (isRosetta()) {
    return skipSearch(false, "Rosetta", logger);
  }
  const globalVipsVersion = globalLibvipsVersion();
  return (
    !!globalVipsVersion /* istanbul ignore next */ &&
    semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion)
  );
};

export {
  minimumLibvipsVersion,
  prebuiltPlatforms,
  buildPlatformArch,
  buildSharpLibvipsIncludeDir,
  buildSharpLibvipsCPlusPlusDir,
  buildSharpLibvipsLibDir,
  isUnsupportedNodeRuntime,
  runtimePlatformArch,
  log,
  yarnLocator,
  spawnRebuild,
  globalLibvipsVersion,
  pkgConfigPath,
  useGlobalLibvips,
};
