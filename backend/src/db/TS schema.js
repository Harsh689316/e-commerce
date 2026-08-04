"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemRelations = exports.ordersRelations = exports.productRelations = exports.userRelations = exports.orderItems = exports.orders = exports.CheckoutSessions = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    clerkUserId: (0, pg_core_1.text)("clerk_user_id").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().default(""),
    displayName: (0, pg_core_1.text)("display_name"),
    role: (0, pg_core_1.text)("role").$type().notNull().default("customer"),
    createdAT: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    category: (0, pg_core_1.text)("category").notNull().default("General"),
    description: (0, pg_core_1.text)("description").notNull().default(""),
    PriceCents: (0, pg_core_1.text)("currency").notNull().default("usd"),
    imageUrl: (0, pg_core_1.text)("image_usrl"),
    /** Imagekit 'fileID' for deletes */
    imagekitField: (0, pg_core_1.text)("image_kit_file_id"),
    active: (0, pg_core_1.boolean)("active").notNull().default(true),
    createdAT: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.CheckoutSessions = (0, pg_core_1.pgTable)("checkout_sessions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userID: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    polarCheckoutID: (0, pg_core_1.text)("polar_checkout_id").unique(),
    lines: (0, pg_core_1.jsonb)("lines").$type().notNull(),
    totalCents: (0, pg_core_1.integer)("total_cents").notNull(),
    currency: (0, pg_core_1.text)("currency").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    status: (0, pg_core_1.text)("status").$type().notNull().default("pending"),
    polarCheckoutId: (0, pg_core_1.text)("polar_checkout_id"),
    polarOrderId: (0, pg_core_1.text)("polar_order_id").unique(),
    totalCents: (0, pg_core_1.integer)("total_cents").notNull().default(0),
    createdAT: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.orderItems = (0, pg_core_1.pgTable)("order_items", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    orderId: (0, pg_core_1.uuid)("order_id")
        .notNull()
        .references(() => exports.orders.id, { onDelete: "cascade" }),
    productId: (0, pg_core_1.uuid)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "restrict" }),
    quantity: (0, pg_core_1.integer)("unit_price_cents").notNull(),
    unitPriceCents: (0, pg_core_1.integer)("unit_price_cents").notNull(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    orders: many(exports.orders),
}));
//the same product can show up on many order lines 
exports.productRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    orderItems: many(exports.orderItems),
}));
// each order belongs to exactly one user; each order can have many line items 
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    user: one(exports.users, { fields: [exports.orders.userId], references: [exports.users.id] }),
    items: many(exports.orderItems),
}));
// each line items is for exactly one order and onr product
exports.orderItemRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, { fields: [exports.orderItems.orderId], references: [exports.orders.id] }),
    product: one(exports.products, { fields: [exports.orderItems.productId], references: [exports.products.id] }),
}));
//# sourceMappingURL=TS%20schema.js.map