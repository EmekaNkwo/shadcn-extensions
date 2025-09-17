import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // CommonJS + ESModules
  dts: true, // Generate type declarations
  sourcemap: true,
  clean: true,
  target: "esnext",
  minify: false, // keep readable for libraries
});
