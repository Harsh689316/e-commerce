"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const express_2 = require("@clerk/express");
const clerk_1 = require("./webhooks/clerk");
const env_1 = require("./lib/env");
const env = (0, env_1.getEnv)();
const app = (0, express_1.default)();
const rawJson = express_1.default.raw({
    type: "application/json",
    limit: "1mb",
});
// Clerk webhook must be before express.json()
app.post("/webhook/clerk", rawJson, (req, res) => {
    void (0, clerk_1.clerkWebhookHandler)(req, res);
});
// IMPORTANT:
// Do not use clerkWebhookHandler for Polar webhook
// Create a separate polarWebhookHandler
app.post("/webhook/polar", express_1.default.raw({ type: "application/json" }), (req, res) => {
    res.status(200).send("Polar webhook received");
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
const publicDir = node_path_1.default.join(process.cwd(), "public");
if (node_fs_1.default.existsSync(publicDir)) {
    app.use(express_1.default.static(publicDir));
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
//# sourceMappingURL=index.js.map