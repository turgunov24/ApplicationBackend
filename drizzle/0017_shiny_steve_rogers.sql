CREATE TABLE "references_counterparties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT 'counterparty_name' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_legal_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT 'legal_form_name' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "principal_customers" ADD COLUMN "counterparty_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD COLUMN "legal_form_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "references_counterparties" ADD CONSTRAINT "references_counterparties_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_legal_forms" ADD CONSTRAINT "references_legal_forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_counterparty_id_references_counterparties_id_fk" FOREIGN KEY ("counterparty_id") REFERENCES "public"."references_counterparties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_legal_form_id_references_legal_forms_id_fk" FOREIGN KEY ("legal_form_id") REFERENCES "public"."references_legal_forms"("id") ON DELETE no action ON UPDATE no action;