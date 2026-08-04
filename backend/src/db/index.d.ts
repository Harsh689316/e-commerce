import "dotenv/config";
import pg from "pg";
import * as schema from "./TS schema.js";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: pg.Pool;
};
//# sourceMappingURL=index.d.ts.map