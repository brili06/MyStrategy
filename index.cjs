const { https } = require("firebase-functions");
const next = require("next");

const isDev = process.env.NODE_ENV !== "production";

const server = next({
  dev: isDev,
  conf: { distDir: ".next" },
});

const nextjsHandle = server.getRequestHandler();

exports.server = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});