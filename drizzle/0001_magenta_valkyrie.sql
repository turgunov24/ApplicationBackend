CREATE TABLE "references_client_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'client_type_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'client_type_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
