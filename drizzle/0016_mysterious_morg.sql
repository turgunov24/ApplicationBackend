CREATE TABLE "principal_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"principal_id" integer NOT NULL,
	"client_type_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_client_type_id_references_client_types_id_fk" FOREIGN KEY ("client_type_id") REFERENCES "public"."references_client_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;