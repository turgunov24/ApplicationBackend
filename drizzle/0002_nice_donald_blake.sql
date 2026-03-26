CREATE TABLE "references_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"lang" varchar(10) NOT NULL,
	"namespace" varchar(100) NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_user_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"lang" varchar(10) NOT NULL,
	"namespace" varchar(100) NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_translations" ADD CONSTRAINT "references_translations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_user_translations" ADD CONSTRAINT "references_user_translations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_user_translations" ADD CONSTRAINT "references_user_translations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "translations_lang_ns_key_idx" ON "references_translations" USING btree ("lang","namespace","key");--> statement-breakpoint
CREATE UNIQUE INDEX "user_translations_user_lang_ns_key_idx" ON "references_user_translations" USING btree ("user_id","lang","namespace","key");