CREATE TABLE "references_task_recurrence" (
	"id" serial PRIMARY KEY NOT NULL,
	"translationKey" varchar(255) DEFAULT 'translation_key' NOT NULL,
	"token" varchar(255) NOT NULL,
	"description" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_task_template_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"translationKey" varchar(255) DEFAULT 'translation_key' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_task_templates" ADD COLUMN "recurrence_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "references_task_templates" ADD COLUMN "task_template_category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "references_task_recurrence" ADD CONSTRAINT "references_task_recurrence_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_task_template_categories" ADD CONSTRAINT "references_task_template_categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_task_templates" ADD CONSTRAINT "references_task_templates_recurrence_id_references_task_recurrence_id_fk" FOREIGN KEY ("recurrence_id") REFERENCES "public"."references_task_recurrence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_task_templates" ADD CONSTRAINT "references_task_templates_task_template_category_id_references_task_template_categories_id_fk" FOREIGN KEY ("task_template_category_id") REFERENCES "public"."references_task_template_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_task_templates" DROP COLUMN "recurrence";