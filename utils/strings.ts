import { customAlphabet } from "nanoid";

export function sid(length = 10): string {
  return customAlphabet("1234567890abcdef", length)();
}
