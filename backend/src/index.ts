import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";

import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";

const env = getEnv();
const app = express();

const rawJson = express.raw({
  type: "application/json",
  limit: "1mb",
});

// Clerk webhook must be before express.json()
app.post(
  "/webhook/clerk",
  rawJson,
  (req, res) => {
    void clerkWebhookHandler(req, res);
  }
);

// IMPORTANT:
// Do not use clerkWebhookHandler for Polar webhook
// Create a separate polarWebhookHandler
app.post(
  "/webhook/polar",
  express.raw({ type: "application/json" }),
  (req, res) => {
    res.status(200).send("Polar webhook received");
  }
);

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const publicDir = path.join(process.cwd(), "public");

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Health check for Render
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});