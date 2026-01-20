CREATE TABLE "references_tariffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'tariff_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'tariff_name_ru' NOT NULL,
	"monthly_price" integer DEFAULT 0 NOT NULL,
	"currency_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "references_tariffs" ADD CONSTRAINT "references_tariffs_currency_id_references_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."references_currencies"("id") ON DELETE no action ON UPDATE no action;