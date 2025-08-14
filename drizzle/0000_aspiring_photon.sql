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
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"token" varchar(500) NOT NULL,
	"password" varchar(20) NOT NULL,
	"username" varchar(50) NOT NULL,
	CONSTRAINT "users_token_unique" UNIQUE("token"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
