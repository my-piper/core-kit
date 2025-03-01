import trim from "lodash/trim";
import { parse } from "qs";
import { Languages } from "../enums/languages";

export function getLabel(source: string, language: Languages): string {
  const labels = parse(source, { delimiter: ";" });
  return trim(
    (labels[language] as string) || (labels["en"] as string) || source
  );
}
