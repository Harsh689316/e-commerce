"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
exports.getEnv = getEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(3001),
    DATABASE_URL: zod_1.z.string().min(1),
    CLERK_PUBLISHABLE_KEY: zod_1.z.string().min(1),
    CLERK_SECRET_KEY: zod_1.z.string().min(1),
    CLERK_WEBHOOK_SECRET: zod_1.z.string().optional(),
    FRONTEND_URL: zod_1.z.string().url(),
    POLAR_ACCESS_TOKEN: zod_1.z.string().optional(),
    POLAR_WEBHOOK_SECRET: zod_1.z.string().optional(),
    POLAR_API_BASE: zod_1.z.string().url().default("https://api.polar.sh"),
    POLAR_CHECKOUT_PRODUCT_ID: zod_1.z.string().uuid(),
    STREAM_API_KEY: zod_1.z.string().min(1),
    STREAM_API_SECRET: zod_1.z.string().min(1),
    IMAGEKIT_PUBLIC_KEY: zod_1.z.string().min(1),
    IMAGEKIT_PRIVATE_KEY: zod_1.z.string().min(1),
    IMAGEKIT_URL_ENDPOINT: zod_1.z.string().url(),
    SENTRY_DSN: zod_1.z.string().url().optional(),
    SENTRY_ENVIRONMENT: zod_1.z.string().optional(),
    SENTRY_TRACES_SAMPLE_RATE: zod_1.z.coerce.number().optional(),
    SENTRY_REPLAY_SAMPLE_RATE: zod_1.z.coerce.number().optional(),
});
function loadEnv() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error("❌ Environment validation failed:");
        console.error(parsed.error.format());

        throw new Error("Invalid environment variables");
    }

    return parsed.data;
}
let cachedEnv = null;
function getEnv() {
    if (!cachedEnv) {
        cachedEnv = loadEnv();
    }
    return cachedEnv;
}
//# sourceMappingURL=env.js.map