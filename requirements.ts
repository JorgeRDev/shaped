const config = {
  libvips: ">=8.15.3",
}

const engines = {
  node: "^18.17.0 || ^20.3.0 || >=21.0.0",
}
const optionalDependencies = {
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
  "@img/sharp-win32-x64": "0.33.5",
}

export { config, engines, optionalDependencies }
