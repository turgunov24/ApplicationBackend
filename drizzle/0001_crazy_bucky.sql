CREATE TABLE "references_permission_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'permission_group_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'permission_group_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'permission_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'permission_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"permission_group_id" integer
);
--> statement-breakpoint
ALTER TABLE "references_permissions" ADD CONSTRAINT "references_permissions_permission_group_id_references_permission_groups_id_fk" FOREIGN KEY ("permission_group_id") REFERENCES "public"."references_permission_groups"("id") ON DELETE cascade ON UPDATE no action;