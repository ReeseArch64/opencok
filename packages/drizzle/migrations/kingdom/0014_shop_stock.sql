CREATE TABLE "opencok_kingdom"."shop_stock" (
	"id" varchar(40) NOT NULL,
	"purchased" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "shop_stock_PRIMARY" PRIMARY KEY("id"),
	CONSTRAINT "shop_stock_nonnegative" CHECK ("purchased" >= 0)
);
