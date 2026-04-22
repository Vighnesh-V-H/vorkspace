CREATE TABLE "ticket" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"assignedTo" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"closedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_assignedTo_user_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ticket_assigned_to_idx" ON "ticket" USING btree ("assignedTo");--> statement-breakpoint
CREATE INDEX "ticket_assigned_open_idx" ON "ticket" USING btree ("assignedTo","closedAt");--> statement-breakpoint
CREATE INDEX "ticket_created_at_idx" ON "ticket" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "ticket_closed_at_idx" ON "ticket" USING btree ("closedAt");--> statement-breakpoint
CREATE INDEX "ticket_assigned_created_idx" ON "ticket" USING btree ("assignedTo","createdAt");--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("providerId","accountId");--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "account_provider_idx" ON "account" USING btree ("providerId");--> statement-breakpoint
CREATE INDEX "account_user_provider_idx" ON "account" USING btree ("userId","providerId");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_value_unique" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
CREATE INDEX "verification_expires_at_idx" ON "verification" USING btree ("expiresAt");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_email_unique" ON "organization" USING btree ("email");--> statement-breakpoint
CREATE INDEX "organization_owner_idx" ON "organization" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "organization_created_at_idx" ON "organization" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "organization_owner_created_idx" ON "organization" USING btree ("owner_id","createdAt");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_invitation_org_email_unique" ON "organization_invitation" USING btree ("organization_id","email");--> statement-breakpoint
CREATE INDEX "organization_invitation_org_idx" ON "organization_invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_invitation_email_idx" ON "organization_invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "organization_invitation_status_idx" ON "organization_invitation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "organization_invitation_expires_idx" ON "organization_invitation" USING btree ("expiresAt");--> statement-breakpoint
CREATE INDEX "organization_invitation_org_status_idx" ON "organization_invitation" USING btree ("organization_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_member_org_user_unique" ON "organization_member" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "organization_member_org_idx" ON "organization_member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_member_user_idx" ON "organization_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "organization_member_role_idx" ON "organization_member" USING btree ("role");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_org_idx" ON "notification" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "notification_user_created_idx" ON "notification" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notification_user_unread_idx" ON "notification" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "notification_entity_idx" ON "notification" USING btree ("entity_type","entity_id");--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "createdAt";