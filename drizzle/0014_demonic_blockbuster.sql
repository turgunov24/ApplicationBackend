ALTER TABLE "references_client_types" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_countries" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_currencies" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_districts" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_permission_groups" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_permissions" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_regions" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_roles" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_tariffs" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_by" SET NOT NULL;