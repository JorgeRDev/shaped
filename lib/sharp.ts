import { familySync, versionSync } from "detect-libc";

import {
  runtimePlatformArch,
  isUnsupportedNodeRuntime,
  prebuiltPlatforms,
  minimumLibvipsVersion,
} from "./libvips";

const runtimePlatform = runtimePlatformArch();

interface SharpModule {
  // Define aquí las propiedades y métodos que esperas del módulo sharp
  resize: (width: number, height: number) => SharpModule;
  toBuffer: () => Promise<Buffer>;
  // Agrega más métodos y propiedades según sea necesario
}

const paths = [
  `../src/build/Release/sharp-${runtimePlatform}.node`,
  "../src/build/Release/sharp-wasm32.node",
  `@img/sharp-${runtimePlatform}/sharp.node`,
  "@img/sharp-wasm32/sharp.node",
];

let sharp: SharpModule | undefined;
const errors: Error[] = [];

const loadSharpModule = async () => {
  for (const path of paths) {
    try {
      sharp = await import(path);
      break;
    } catch (error) {
      errors.push(error as Error);
    }
  }

  if (!sharp) {
    const [isLinux, isMacOs, isWindows] = ["linux", "darwin", "win32"].map(
      (os) => runtimePlatform.startsWith(os)
    );

    const help = [
      `Could not load the "sharp" module using the ${runtimePlatform} runtime`,
    ];
    errors.forEach((err) => {
      if (err.code !== "MODULE_NOT_FOUND") {
        help.push(`${err.code}: ${err.message}`);
      }
    });
    const messages = errors.map((err) => err.message).join(" ");
    help.push("Possible solutions:");
    // Common error messages
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
          config,
        } = require(`@img/sharp-libvips-${runtimePlatform}/package`);
        const libcFound = `${familySync()} ${versionSync()}`;
        const libcRequires = `${config.musl ? "musl" : "glibc"} ${
          config.musl || config.glibc
        }`;
        help.push(
          "- Update your OS:",
          `    Found ${libcFound}`,
          `    Requires ${libcRequires}`
        );
      } catch (errEngines) {}
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
    // Link to installation docs
    if (
      isWindows &&
      /The specified procedure could not be found/.test(messages)
    ) {
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

export default loadSharpModule();