import type { UserRole } from "../db/TS schema.ts";
export declare function parseRole(value: unknown): "customer" | undefined;
export declare function isAdmin(role: UserRole): role is "admin";
export declare function isStaff(role: UserRole): role is "support" | "admin";
//# sourceMappingURL=roles.d.ts.map