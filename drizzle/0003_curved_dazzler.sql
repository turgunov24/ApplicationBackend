CREATE TABLE "references_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" serial NOT NULL,
	"translationKey" varchar(255) DEFAULT 'client_type_name_uz' NOT NULL,
	"description" varchar(500),
	"deadline" timestamp,
	"principal_customer_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_by" integer NOT NULL,
	CONSTRAINT "references_tasks_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
ALTER TABLE "references_tasks" ADD CONSTRAINT "references_tasks_principal_customer_id_principal_customers_id_fk" FOREIGN KEY ("principal_customer_id") REFERENCES "public"."principal_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_tasks" ADD CONSTRAINT "references_tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;