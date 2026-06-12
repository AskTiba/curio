import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uuid,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

export const feedStatusEnum = pgEnum("feed_status", ["healthy", "stale", "error"]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().unique(),
    displayName: text("display_name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("profiles_user_id_idx").on(table.userId),
  })
);

export const feeds = pgTable(
  "feeds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    title: text("title"),
    description: text("description"),
    siteUrl: text("site_url"),
    iconUrl: text("icon_url"),
    status: feedStatusEnum("status").default("healthy").notNull(),
    lastFetchedAt: timestamp("last_fetched_at"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    urlIdx: uniqueIndex("feeds_url_idx").on(table.url),
  })
);

export const feedItems = pgTable(
  "feed_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    guid: text("guid"),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    author: text("author"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    feedIdIdx: index("feed_items_feed_id_idx").on(table.feedId),
    publishedAtIdx: index("feed_items_published_at_idx").on(table.publishedAt),
    urlFeedIdUnique: uniqueIndex("feed_items_url_feed_id_unique").on(
      table.url,
      table.feedId
    ),
  })
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("categories_user_id_idx").on(table.userId),
    userCategoryUnique: uniqueIndex("categories_user_category_unique").on(
      table.userId,
      table.name
    ),
  })
);

export const userFeeds = pgTable(
  "user_feeds",
  {
    userId: text("user_id").notNull(),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    customTitle: text("custom_title"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.feedId] }),
    userIdIdx: index("user_feeds_user_id_idx").on(table.userId),
    categoryIdIdx: index("user_feeds_category_id_idx").on(table.categoryId),
  })
);

export const userInteractions = pgTable(
  "user_interactions",
  {
    userId: text("user_id").notNull(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => feedItems.id, { onDelete: "cascade" }),
    isRead: boolean("is_read").default(false).notNull(),
    isBookmarked: boolean("is_bookmarked").default(false).notNull(),
    readAt: timestamp("read_at"),
    bookmarkedAt: timestamp("bookmarked_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.itemId] }),
    userIdIdx: index("user_interactions_user_id_idx").on(table.userId),
    itemIdIdx: index("user_interactions_item_id_idx").on(table.itemId),
    unreadFilterIdx: index("user_interactions_unread_idx").on(
      table.userId,
      table.isRead
    ),
  })
);

export const userPreferences = pgTable(
  "user_preferences",
  {
    userId: text("user_id").primaryKey(),
    theme: text("theme").default("system").notNull(),
    layout: text("layout").default("list").notNull(),
    refreshInterval: integer("refresh_interval").default(30).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);
