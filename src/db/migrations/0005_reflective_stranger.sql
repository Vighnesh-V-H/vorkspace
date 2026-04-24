CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."organization_role" AS ENUM('owner', 'admin', 'member', 'viewer');--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_invitation" DROP CONSTRAINT "organization_invitation_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" DROP CONSTRAINT "organization_member_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" DROP CONSTRAINT "organization_member_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "organization_created_at_idx";--> statement-breakpoint
DROP INDEX "organization_owner_created_idx";--> statement-breakpoint
DROP INDEX "organization_invitation_status_idx";--> statement-breakpoint
DROP INDEX "organization_invitation_org_status_idx";--> statement-breakpoint
DROP INDEX "organization_member_role_idx";--> statement-breakpoint
DROP INDEX "organization_invitation_org_email_unique";--> statement-breakpoint
DROP INDEX "organization_member_org_user_unique";--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "role" SET DEFAULT 'member'::"public"."organization_role";--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "role" SET DATA TYPE "public"."organization_role" USING "role"::"public"."organization_role";--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."invitation_status";--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "status" SET DATA TYPE "public"."invitation_status" USING "status"::"public"."invitation_status";--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organization_invitation" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_member" ALTER COLUMN "role" SET DEFAULT 'member'::"public"."organization_role";--> statement-breakpoint
ALTER TABLE "organization_member" ALTER COLUMN "role" SET DATA TYPE "public"."organization_role" USING "role"::"public"."organization_role";--> statement-breakpoint
ALTER TABLE "organization_member" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_member" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "deletedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_invitation" ADD COLUMN "invited_by" text;--> statement-breakpoint
ALTER TABLE "organization_invitation" ADD COLUMN "respondedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_member" ADD COLUMN "lastActiveAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization_member" ADD COLUMN "removedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "organization_invitation" ADD CONSTRAINT "organization_invitation_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "organization_invitation" ADD CONSTRAINT "organization_invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_invitation_org_email_unique" ON "organization_invitation" USING btree ("organization_id","email") WHERE "organization_invitation"."status" = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "organization_member_org_user_unique" ON "organization_member" USING btree ("organization_id","user_id") WHERE "organization_member"."removedAt" IS NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "organization_invitation" ADD CONSTRAINT "invitation_expires_after_created" CHECK ("organization_invitation"."expiresAt" > "organization_invitation"."createdAt");