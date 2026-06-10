"use strict";

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

process.on("uncaughtException", (error) => {
  console.error("[MonsterASP/IISNode] uncaughtException:");
  console.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[MonsterASP/IISNode] unhandledRejection:");
  console.error(reason);
  process.exit(1);
});

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const rootDir = __dirname;

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function toFileUrlPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

console.error("[MonsterASP/IISNode] Booting...");
console.error("[MonsterASP/IISNode] cwd:", process.cwd());
console.error("[MonsterASP/IISNode] __dirname:", __dirname);
console.error("[MonsterASP/IISNode] node:", process.version);
console.error("[MonsterASP/IISNode] PORT:", process.env.PORT || "(not set)");

const dataDir = path.join(rootDir, "App_Data");
ensureDir(dataDir);

const dbPath = toFileUrlPath(path.join(dataDir, "db.sqlite"));
process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${dbPath}`;

const publicDir = path.join(rootDir, "public");
const uploadsDir = path.join(publicDir, "uploads");
ensureDir(publicDir);
ensureDir(uploadsDir);

console.error("[MonsterASP/IISNode] DATABASE_URL:", process.env.DATABASE_URL);

const entry = path.join(rootDir, "api", "index.mjs");

if (!fs.existsSync(entry)) {
  console.error("[MonsterASP/IISNode] API entry file not found:", entry);
  process.exit(1);
}

console.error("[MonsterASP/IISNode] Loading API entry:", entry);

import(pathToFileURL(entry).href).catch((error) => {
  console.error("[MonsterASP/IISNode] Failed to load ESM server:");
  console.error(error);
  process.exit(1);
});
