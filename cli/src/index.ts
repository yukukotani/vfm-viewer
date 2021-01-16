#!/usr/bin/env node

import { Arguments, default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";
import open from "open";

import { launch } from "@vfm-viewer/server";

yargs(hideBin(process.argv))
  .demandCommand()
  .command(
    "preview [file]",
    "Preview",
    {
      port: {
        alias: "p",
        default: 3000,
        type: "number",
      },
    },
    (argv: Arguments) => {
      const port = argv["port"] as number;
      console.log("Starting preview...");

      launch(argv["file"] as string, port);

      const url = `http://localhost:${port}/client/index.html`;
      open(url);
      console.log(`Started. Listening on ${url}`);
    }
  )
  .help("h")
  .alias("h", "help")
  .strict().argv;
