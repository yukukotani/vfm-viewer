const path = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./index.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      react: path.resolve("../node_modules/react"),
    },
    fallback: {
      buffer: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
      },
    ],
  },
};
