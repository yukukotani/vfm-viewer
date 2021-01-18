#!/usr/bin/env node

import { Arguments, default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";
import open from "open";
import { cosmiconfigSync } from "cosmiconfig";

import { launch } from "@vfm-viewer/server";

const configLoader = cosmiconfigSync("vivliostyle");

yargs(hideBin(process.argv))
  .demandCommand()
  .options({
    config: {
      alias: "c",
      default: "vivliostyle.config.js",
      type: "string",
      description: "Path to config file",
    },
  })
  .command(
    "preview [file]",
    "Preview typesetting result",
    {
      port: {
        alias: "p",
        default: 3000,
        type: "number",
      },
    },
    (argv: Arguments) => {
      const config = configLoader.load(argv["config"] as string);
      if (!config) {
        throw Error("config not found");
      }

      const port = argv["port"] as number;
      console.log("Starting preview...");

      const viewerConfig = { port, ...config.config };

      launch(argv["file"] as string, viewerConfig);

      const url = `http://localhost:${port}/client/index.html?size=${viewerConfig.size}`;
      open(url);
      console.log(`Started. Listening on ${url}`);
    }
  )
  .help("h")
  .alias("h", "help")
  .strict().argv;
