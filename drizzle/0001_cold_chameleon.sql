ALTER TABLE "references_counterparties" ADD COLUMN "phone" varchar(255);--> statement-breakpoint
UPDATE "references_counterparties" SET "phone" = '+998901234567' WHERE name = 'Contoso Ltd.';--> statement-breakpoint
UPDATE "references_counterparties" SET "phone" = '+998907654321' WHERE name = 'Acme Corp.';--> statement-breakpoint
UPDATE "references_counterparties" SET "phone" = '+9989000000' || CAST(id AS varchar) WHERE "phone" IS NULL;--> statement-breakpoint
ALTER TABLE "references_counterparties" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "references_counterparties" ADD CONSTRAINT "references_counterparties_phone_unique" UNIQUE("phone");