import trim from "lodash/trim";
import { parse } from "qs";
import { Languages } from "../enums/languages";

export type Labels = { [Languages.en]: string } & {
  [key in Languages]?: string;
};

export function allLabels(source: string): Labels {
  const labels = parse(source, { delimiter: ";" });
  if (Languages.en in labels) {
    return labels as Labels;
  }
  return { [Languages.en]: source };
}

export function getLabel(source: string, language: Languages): string {
  const labels = allLabels(source);
  return trim(labels[language] || labels[Languages.en]);
}
