import "../../env";

export const REDIS_URL = process.env["REDIS_URL"] || "redis://redis:6379/";
export const REDIS_PASSWORD = process.env["REDIS_PASSWORD"] || "";
