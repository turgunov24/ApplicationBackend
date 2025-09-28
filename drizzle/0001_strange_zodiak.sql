CREATE TABLE "users_rel_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_rel_permissions_user_id_permission_id_unique" UNIQUE("user_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "references_permissions" ADD COLUMN "resource" varchar(255);--> statement-breakpoint
ALTER TABLE "users_rel_permissions" ADD CONSTRAINT "users_rel_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_rel_permissions" ADD CONSTRAINT "users_rel_permissions_permission_id_references_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."references_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_permissions" DROP COLUMN "recource";