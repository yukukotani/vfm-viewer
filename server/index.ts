import { ServerResponse } from "http";
import { default as fastify, FastifyReply } from "fastify";
import fastifyCors from "fastify-cors";
import fastifyStatic from "fastify-static";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

var connection: FastifyReply | null = null;

main();

async function main() {
  console.log(`Starting previewing ${process.argv[2]}`);
  await launch(process.argv[2]);

  const url = "http://localhost:3000/client/index.html";
  console.log(`Started. Listening on ${url}`);
}

async function launch(markdownPath: string) {
  const server = fastify();
  server.register(fastifyCors, {
    origin: "*",
  });
  server.register(fastifyStatic, {
    root: path.join(__dirname, "client"),
    prefix: "/client",
  });
  server.get("/events", async (_, res) => {
    connection = res;
    res.raw.setHeader("Connection", "Keep-Alive");
    res.raw.setHeader("Cache-Control", "no-cache");
    res.raw.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.raw.setHeader("Content-Encoding", "none");
    res.raw.setHeader("Access-Control-Allow-Origin", "*");
    await sendMarkdown(res.raw, markdownPath);
  });
  await server.listen(3000);

  chokidar.watch(markdownPath).on("change", async (newPath: string) => {
    if (!connection) return;
    await sendMarkdown(connection.raw, newPath);
  });
}

async function sendMarkdown(connection: ServerResponse, path: string) {
  const content = fs.readFileSync(path, "utf-8").toString();
  const json = JSON.stringify({
    markdown: content,
  });
  connection.write(`data: ${json}`);
  connection.write("\n\n");
}
