CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "organization_notification" CASCADE;