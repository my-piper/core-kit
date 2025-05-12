import { Telegraf } from "telegraf";
import { createLogger } from "../logger";
import { TELEGRAM_BOT_TOKEN } from "./consts";

const logger = createLogger("telegram");

export default new Telegraf(TELEGRAM_BOT_TOKEN);
