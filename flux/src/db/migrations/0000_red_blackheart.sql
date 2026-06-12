CREATE TYPE "public"."feed_status" AS ENUM('healthy', 'stale', 'error');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feed_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feed_id" uuid NOT NULL,
	"guid" text,
	"title" text NOT NULL,
	"excerpt" text,
	"content" text,
	"author" text,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"description" text,
	"site_url" text,
	"icon_url" text,
	"status" "feed_status" DEFAULT 'healthy' NOT NULL,
	"last_fetched_at" timestamp,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_feeds" (
	"user_id" text NOT NULL,
	"feed_id" uuid NOT NULL,
	"category_id" uuid,
	"custom_title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_feeds_user_id_feed_id_pk" PRIMARY KEY("user_id","feed_id")
);
--> statement-breakpoint
CREATE TABLE "user_interactions" (
	"user_id" text NOT NULL,
	"item_id" uuid NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_bookmarked" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"bookmarked_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_interactions_user_id_item_id_pk" PRIMARY KEY("user_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"user_id" text PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"layout" text DEFAULT 'list' NOT NULL,
	"refresh_interval" integer DEFAULT 30 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feeds" ADD CONSTRAINT "user_feeds_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feeds" ADD CONSTRAINT "user_feeds_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_item_id_feed_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."feed_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_user_id_idx" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_category_unique" ON "categories" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "feed_items_feed_id_idx" ON "feed_items" USING btree ("feed_id");--> statement-breakpoint
CREATE INDEX "feed_items_published_at_idx" ON "feed_items" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "feed_items_url_feed_id_unique" ON "feed_items" USING btree ("url","feed_id");--> statement-breakpoint
CREATE UNIQUE INDEX "feeds_url_idx" ON "feeds" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_id_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_feeds_user_id_idx" ON "user_feeds" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_feeds_category_id_idx" ON "user_feeds" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "user_interactions_user_id_idx" ON "user_interactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_interactions_item_id_idx" ON "user_interactions" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "user_interactions_unread_idx" ON "user_interactions" USING btree ("user_id","is_read");