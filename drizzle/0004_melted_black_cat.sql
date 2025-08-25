ALTER TABLE "references_permissions" ALTER COLUMN "permission_group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_permissions" ADD COLUMN "descriptionUz" varchar(500);--> statement-breakpoint
ALTER TABLE "references_permissions" ADD COLUMN "descriptionRu" varchar(500);