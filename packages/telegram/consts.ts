import env from "../../env";

export const TELEGRAM_BOT_TOKEN = env["TELEGRAM_BOT_TOKEN"] || "xyzXYZ";
export const TELEGRAM_BOT_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN!}`;
export const TELEGRAM_BOT_FILE_URL = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN!}`;
