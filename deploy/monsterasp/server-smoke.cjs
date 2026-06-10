"use strict";

const http = require("http");

process.on("uncaughtException", (error) => {
  console.error("[Monster Smoke] uncaughtException:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Monster Smoke] unhandledRejection:", reason);
  process.exit(1);
});

const port = process.env.PORT;

console.error("[Monster Smoke] Booting...");
console.error("[Monster Smoke] Node:", process.version);
console.error("[Monster Smoke] cwd:", process.cwd());
console.error("[Monster Smoke] dirname:", __dirname);
console.error("[Monster Smoke] PORT:", port);

if (!port) {
  console.error("[Monster Smoke] Missing process.env.PORT");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({
    ok: true,
    message: "Monster IISNode smoke server is working",
    url: req.url,
    portType: String(port).startsWith("\\\\.\\pipe\\") ? "iisnode-pipe" : "numeric-or-other"
  }));
});

server.on("error", (error) => {
  console.error("[Monster Smoke] server error:", error);
  process.exit(1);
});

server.listen(port, () => {
  console.error("[Monster Smoke] listening successfully");
});
