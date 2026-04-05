CREATE TABLE "references_task_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"translationKey" varchar(255) DEFAULT 'translation_key' NOT NULL,
	"description" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"recurrence" text DEFAULT 'once' NOT NULL,
	"date" timestamp,
	"day_of_month" integer,
	"month_of_quarter" integer,
	"month_of_year" integer,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_task_templates" ADD CONSTRAINT "references_task_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;