CREATE TABLE "references_attach_template_to_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"principal_customer_id" integer NOT NULL,
	"task_template_id" integer NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_attach_template_to_task" ADD CONSTRAINT "references_attach_template_to_task_principal_customer_id_principal_customers_id_fk" FOREIGN KEY ("principal_customer_id") REFERENCES "public"."principal_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_attach_template_to_task" ADD CONSTRAINT "references_attach_template_to_task_task_template_id_references_task_templates_id_fk" FOREIGN KEY ("task_template_id") REFERENCES "public"."references_task_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_attach_template_to_task" ADD CONSTRAINT "references_attach_template_to_task_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;