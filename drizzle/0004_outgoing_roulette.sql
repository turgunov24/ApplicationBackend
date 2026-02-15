ALTER TABLE "references_countries" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "references_districts" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "references_regions" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "references_countries" ADD CONSTRAINT "references_countries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_districts" ADD CONSTRAINT "references_districts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_regions" ADD CONSTRAINT "references_regions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;