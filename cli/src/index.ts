#!/usr/bin/env node

import { Arguments, default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";

import { launch } from "@vfm-viewer/server";

yargs(hideBin(process.argv)).command(
  "preview [file]",
  "Preview",
  () => {},
  (argv: Arguments) => {
    console.log("Starting preview...");
    launch(argv["file"] as string);

    const url = "http://localhost:3000/client/index.html";
    open(url);
    console.log(`Started. Listening on ${url}`);
  }
).argv;
