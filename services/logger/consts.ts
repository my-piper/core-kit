import "../../env";

export const LOG_LEVEL = process.env["LOG_LEVEL"] || "info";
export const LOG_PRETTY = !!process.env["LOG_PRETTY"];
