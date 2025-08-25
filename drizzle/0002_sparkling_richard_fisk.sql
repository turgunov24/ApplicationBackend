CREATE TABLE "references_roles_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'role_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'role_name_ru' NOT NULL,
	"descriptionUz" varchar(500),
	"descriptionRu" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_roles_permissions" ADD CONSTRAINT "references_roles_permissions_role_id_references_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."references_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_roles_permissions" ADD CONSTRAINT "references_roles_permissions_permission_id_references_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."references_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_references_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."references_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role_id";