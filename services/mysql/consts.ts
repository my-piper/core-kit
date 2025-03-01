export const MYSQL_HOST = process.env["MYSQL_HOST"] || "mysql";
export const MYSQL_USER = process.env["MYSQL_USER"] || "billing";
export const MYSQL_PASSWORD = process.env["MYSQL_PASSWORD"] || "xyzXYZ";
export const MYSQL_DB = process.env["MYSQL_DB"] || "billing";
export const MYSQL_MIGRATION_TABLE_NAME =
  process.env["MYSQL_MIGRATION_TABLE_NAME"] || "knex_migrations";

export const KNEX_POOL_MAX =
  (() => {
    const max = process.env["KNEX_POOL_MAX"];
    if (!!max) {
      return parseInt(max);
    }
    return null;
  })() || 30;
