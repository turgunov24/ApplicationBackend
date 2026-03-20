ALTER TABLE "principal_customers" ADD COLUMN "inn" integer DEFAULT 0;--> statement-breakpoint
UPDATE "principal_customers" SET "inn" = 0 WHERE "inn" IS NULL;--> statement-breakpoint
ALTER TABLE "principal_customers" ALTER COLUMN "inn" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "principal_customers" ALTER COLUMN "inn" DROP DEFAULT;