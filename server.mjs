import { createServer } from "node:http";
import { hostname } from "node:os";
import { join } from "node:path";
import express from "express";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const app = express();
const distPath = join(process.cwd(), "dist");

app.use(express.static(distPath));
app.get("/proxy/favicon/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;
    if (!/^[a-z0-9.-]+$/i.test(domain)) return res.sendStatus(400);
    const upstream = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
    if (!upstream.ok) return res.sendStatus(upstream.status);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.type(upstream.headers.get("content-type") || "image/png");
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    res.sendStatus(502);
  }
});
app.use("/scram/", express.static(scramjetPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/scramjet/", (_req, res) => res.status(502).type("text").send("The proxy could not load this page."));
app.use((req, res) => res.sendFile(join(distPath, "index.html")));

const server = createServer((req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url?.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

const port = Number(process.env.PORT) || 8080;
server.listen(port, () => {
  console.log(`StudyShelf proxy server: http://${hostname()}:${port}`);
});