import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/**/*.ts", "requirements.ts"],
});
