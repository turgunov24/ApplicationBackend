CREATE TABLE "references_task_actions_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"type" text DEFAULT 'changeStatus' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_task_actions_history" ADD CONSTRAINT "references_task_actions_history_task_id_references_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."references_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_task_actions_history" ADD CONSTRAINT "references_task_actions_history_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;