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

// requirements.ts
var requirements_exports = {};
__export(requirements_exports, {
  config: () => config,
  engines: () => engines,
  optionalDependencies: () => optionalDependencies
});
module.exports = __toCommonJS(requirements_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  engines,
  optionalDependencies
});
