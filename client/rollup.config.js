import path from "path";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "index.tsx",
  output: {
    dir: "dist",
    format: "iife",
  },
  plugins: [
    replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
    alias({
      entries: {
        react: path.resolve("../node_modules/react"),
      },
    }),
    nodeResolve({
      browser: true,
      extensions,
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      compact: false,
      extensions,
    }),
    json(),
  ],
};
