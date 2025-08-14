ALTER TABLE "users" DROP CONSTRAINT "users_token_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "token" DROP NOT NULL;