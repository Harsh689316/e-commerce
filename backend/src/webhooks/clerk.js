"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkWebhookHandler = clerkWebhookHandler;
const env_1 = require("../lib/env");
const webhooks_1 = require("@clerk/backend/webhooks");
const roles_1 = require("../lib/roles");
const db_1 = require("../db");
const TS_schema_1 = require("../db/TS schema");
const drizzle_orm_1 = require("drizzle-orm");
async function clerkWebhookHandler(req, res) {
    const env = (0, env_1.getEnv)();
    try {
        // webhook verification needs a shared secret; without it we cannot trust incoming POSTs.
        if (!env.CLERK_WEBHOOK_SECRET) {
            res.status(503).send("Webhooks secret is not provided");
            return;
        }
        // Clerk's verifier expects a Web Request with the raw body; Express may give Buffer or string.
        const payload = req.body instanceof Buffer ? req.body.toString("utf8") : String(req.body);
        const request = new Request("http://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers(req.headers),
            body: payload,
        });
        // throws if signature is wrong or body was tampered with; only then we trust evt.
        const evt = await (0, webhooks_1.verifyWebhook)(request, { signingSecret: env.CLERK_WEBHOOK_SECRET });
        if (evt.type === "user.created" || evt.type === "user.updated") {
            const u = evt.data;
            const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
                u.email_addresses?.[0]?.email_address;
            const displayName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || null;
            const role = (0, roles_1.parseRole)(u.public_metadata?.role);
            await db_1.db
                .insert(TS_schema_1.users)
                .values({
                clerkUserId: u.id,
                email,
                displayName,
                role,
            })
                .onConflictDoUpdate({
                target: TS_schema_1.users.clerkUserId,
                set: { email, displayName, role, updatedAt: new Date() },
            });
        }
        if (evt.type === "user.deleted") {
            const id = evt.data.id;
            if (id) {
                await db_1.db.delete(TS_schema_1.users).where((0, drizzle_orm_1.eq)(TS_schema_1.users.clerkUserId, id));
            }
        }
        res.json({ ok: true });
    }
    catch (err) {
        // Bad signature, malformed payload, or DB error — do not leak details to the client.
        console.error("Clerk webhook error", err);
        res.status(400).json({ error: "Invalid webhook" });
    }
}
//# sourceMappingURL=clerk.js.map