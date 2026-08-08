///  <reference types="node" />
import { defineConfig } from "drizzle-kit";
import "dotenv/config";
export default defineConfig({
    schema: "./src/db/TS schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? "",
    },
});

// do not change it