CREATE TABLE "references_countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'country_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'country_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_districts" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'district_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'district_name_ru' NOT NULL,
	"region_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_permission_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'permission_group_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'permission_group_name_ru' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
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
	"recource" varchar(255),
	"action" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "references_regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"nameUz" varchar(255) DEFAULT 'region_name_uz' NOT NULL,
	"nameRu" varchar(255) DEFAULT 'region_name_ru' NOT NULL,
	"country_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "references_roles_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "references_roles_permissions_role_id_permission_id_unique" UNIQUE("role_id","permission_id")
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
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_roles_user_id_role_id_unique" UNIQUE("user_id","role_id")
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
	"avatar_path" text DEFAULT 'uploads/avatars/default-avatar.jpg' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "references_districts" ADD CONSTRAINT "references_districts_region_id_references_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."references_regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_permissions" ADD CONSTRAINT "references_permissions_permission_group_id_references_permission_groups_id_fk" FOREIGN KEY ("permission_group_id") REFERENCES "public"."references_permission_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_regions" ADD CONSTRAINT "references_regions_country_id_references_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."references_countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_roles_permissions" ADD CONSTRAINT "references_roles_permissions_role_id_references_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."references_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "references_roles_permissions" ADD CONSTRAINT "references_roles_permissions_permission_id_references_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."references_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_references_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."references_roles"("id") ON DELETE cascade ON UPDATE no action;