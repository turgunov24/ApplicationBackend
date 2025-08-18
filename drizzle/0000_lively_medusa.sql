CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"token" varchar(500) NOT NULL,
	CONSTRAINT "organizations_token_unique" UNIQUE("token")
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
	"role_id" integer NOT NULL,
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
