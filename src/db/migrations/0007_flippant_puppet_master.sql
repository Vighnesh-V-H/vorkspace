CREATE TYPE "public"."ticket_tag" AS ENUM('bug', 'feature', 'improvement');--> statement-breakpoint
ALTER TABLE "ticket" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ticket" ADD COLUMN "tag" "ticket_tag" DEFAULT 'bug' NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ticket_org_idx" ON "ticket" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "ticket_tag_idx" ON "ticket" USING btree ("tag");