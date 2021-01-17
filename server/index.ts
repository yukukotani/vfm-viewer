import { ServerResponse } from "http";
import { default as fastify, FastifyReply } from "fastify";
import fastifyCors from "fastify-cors";
import fastifyStatic from "fastify-static";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";

interface ViewerOption {
  port: number;
  theme: string;
  size: string;
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const connections: {
  [id: number]: FastifyReply;
} = {};

export async function launch(markdownPath: string, option: ViewerOption) {
  const server = fastify();
  server.register(fastifyCors, {
    origin: "*",
  });
  server.register(fastifyStatic, {
    root: path.join(__dirname, "client"),
    prefix: "/client",
  });
  server.get("/dist/theme.css", (_, res) => {
    const content = fs.readFileSync(
      path.join(process.cwd(), option.theme),
      "utf-8"
    );
    res.send(content);
  });
  server.get("/events", async (_, res) => {
    const connectionId = Math.random();
    res.raw.on("close", () => {
      delete connections[connectionId];
    });
    connections[connectionId] = res;
    res.raw.setHeader("Connection", "Keep-Alive");
    res.raw.setHeader("Cache-Control", "no-cache");
    res.raw.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.raw.setHeader("Content-Encoding", "none");
    res.raw.setHeader("Access-Control-Allow-Origin", "*");
    await sendMarkdown(res.raw, markdownPath);
  });
  await server.listen(option.port);

  chokidar.watch(markdownPath).on("change", async (newPath: string) => {
    Object.values(connections).forEach((connection) => {
      sendMarkdown(connection.raw, newPath);
    });
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
