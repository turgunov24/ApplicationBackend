CREATE TABLE "principal_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"principal_id" integer NOT NULL,
	"client_type_id" integer NOT NULL,
	"counterparty_id" integer NOT NULL,
	"legal_form_id" integer NOT NULL,
	"inn" integer NOT NULL,
	"esp_path" text,
	"esp_expire_date" timestamp,
	"created_by" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "principals" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"country_id" integer NOT NULL,
	"region_id" integer NOT NULL,
	"city_id" integer NOT NULL,
	"token" varchar(500),
	"password" varchar(100) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"avatar_path" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	CONSTRAINT "principals_username_unique" UNIQUE("username"),
	CONSTRAINT "principals_email_unique" UNIQUE("email"),
	CONSTRAINT "principals_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "references_attach_tariff_to_principal_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"principal_customer_id" integer NOT NULL,
	"tariff_id" integer NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_client_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'client_type_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'client_type_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_counterparties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT 'counterparty_name' NOT NULL,
	"phone" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL,
	CONSTRAINT "references_counterparties_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "references_countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'country_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'country_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_currencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'currency_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'currency_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_districts" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'district_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'district_name_ru' NOT NULL,
	"region_id" integer NOT NULL,
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
CREATE TABLE "references_permission_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'permission_group_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'permission_group_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'permission_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'permission_name_ru' NOT NULL,
	"descriptionUz" varchar(500),
	"descriptionRu" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"permission_group_id" integer NOT NULL,
	"resource" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_principal_customer_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(100) NOT NULL,
	"additionalInformationUz" varchar(500),
	"additionalInformationRu" varchar(500),
	"principal_customer_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'region_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'region_name_ru' NOT NULL,
	"country_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_roles_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "references_roles_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "references_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'role_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'role_name_ru' NOT NULL,
	"descriptionUz" varchar(500),
	"descriptionRu" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT 'service_name' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_tariffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'tariff_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'tariff_name_ru' NOT NULL,
	"monthly_price" integer DEFAULT 0 NOT NULL,
	"currency_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"country_id" integer NOT NULL,
	"region_id" integer NOT NULL,
	"city_id" integer NOT NULL,
	"token" varchar(500),
	"password" varchar(100) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"avatar_path" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_principal_id_principals_id_fk" FOREIGN KEY ("principal_id") REFERENCES "public"."principals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_client_type_id_references_client_types_id_fk" FOREIGN KEY ("client_type_id") REFERENCES "public"."references_client_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_counterparty_id_references_counterparties_id_fk" FOREIGN KEY ("counterparty_id") REFERENCES "public"."references_counterparties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_legal_form_id_references_legal_forms_id_fk" FOREIGN KEY ("legal_form_id") REFERENCES "public"."references_legal_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "principal_customers" ADD CONSTRAINT "principal_customers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_attach_tariff_to_principal_customers" ADD CONSTRAINT "references_attach_tariff_to_principal_customers_principal_customer_id_principal_customers_id_fk" FOREIGN KEY ("principal_customer_id") REFERENCES "public"."principal_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_attach_tariff_to_principal_customers" ADD CONSTRAINT "references_attach_tariff_to_principal_customers_tariff_id_references_tariffs_id_fk" FOREIGN KEY ("tariff_id") REFERENCES "public"."references_tariffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_attach_tariff_to_principal_customers" ADD CONSTRAINT "references_attach_tariff_to_principal_customers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_client_types" ADD CONSTRAINT "references_client_types_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_counterparties" ADD CONSTRAINT "references_counterparties_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_countries" ADD CONSTRAINT "references_countries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_currencies" ADD CONSTRAINT "references_currencies_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_districts" ADD CONSTRAINT "references_districts_region_id_references_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."references_regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_districts" ADD CONSTRAINT "references_districts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_legal_forms" ADD CONSTRAINT "references_legal_forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_permission_groups" ADD CONSTRAINT "references_permission_groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_permissions" ADD CONSTRAINT "references_permissions_permission_group_id_references_permission_groups_id_fk" FOREIGN KEY ("permission_group_id") REFERENCES "public"."references_permission_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_permissions" ADD CONSTRAINT "references_permissions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_principal_customer_credentials" ADD CONSTRAINT "references_principal_customer_credentials_service_id_references_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."references_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_principal_customer_credentials" ADD CONSTRAINT "references_principal_customer_credentials_principal_customer_id_principal_customers_id_fk" FOREIGN KEY ("principal_customer_id") REFERENCES "public"."principal_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_principal_customer_credentials" ADD CONSTRAINT "references_principal_customer_credentials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_regions" ADD CONSTRAINT "references_regions_country_id_references_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."references_countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_regions" ADD CONSTRAINT "references_regions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_roles_permissions" ADD CONSTRAINT "references_roles_permissions_role_id_references_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."references_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_roles_permissions" ADD CONSTRAINT "references_roles_permissions_permission_id_references_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."references_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_roles" ADD CONSTRAINT "references_roles_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_services" ADD CONSTRAINT "references_services_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_tariffs" ADD CONSTRAINT "references_tariffs_currency_id_references_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."references_currencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_tariffs" ADD CONSTRAINT "references_tariffs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_references_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."references_roles"("id") ON DELETE cascade ON UPDATE no action;