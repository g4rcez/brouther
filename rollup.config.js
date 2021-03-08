import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import url from "@rollup/plugin-url";
import bundleSize from "rollup-plugin-bundle-size";
import optimize from "rollup-plugin-optimize-js";
import external from "rollup-plugin-peer-deps-external";
import progress from "rollup-plugin-progress";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      plugins: [terser()],
      exports: "named",
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: "esm",
      exports: "named",
      sourcemap: false,
    },
  ],
  external: ["react", "history"],
  plugins: [
    progress(),
    strip(),
    external(),
    url(),
    resolve({ browser: true, preferBuiltins: true }),
    typescript({ target: "es2019" }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".tsx", ".ts"],
    }),
    commonjs({ sourceMap: false, ignoreGlobal: false }),
    optimize(),
    bundleSize(),
  ],
};
