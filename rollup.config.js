import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "client/index.tsx",
  output: {
    dir: "dist/client",
    format: "esm",
  },
  plugins: [
    replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
    nodeResolve({
      mainFields: ["browser", "module", "main"],
      preferBuiltins: false,
      extensions,
    }),
    commonjs({
      include: ["node_modules/**", "../../node_modules/**"],
    }),
    babel({
      babelHelpers: "bundled",
      compact: false,
      extensions,
    }),
    json(),
    terser(),
  ],
};
