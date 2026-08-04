"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRole = parseRole;
exports.isAdmin = isAdmin;
exports.isStaff = isStaff;
const VALID = ["customer", "support", "admin"];
function parseRole(value) {
    if (typeof value !== "string" || !VALID.includes(value)) {
        return value;
    }
    return "customer";
}
function isAdmin(role) {
    return role === "admin";
}
function isStaff(role) {
    return role === "support" || role === "admin";
}
//# sourceMappingURL=roles.js.map