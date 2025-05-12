import trim from "lodash/trim";
import { parse } from "qs";
import { Languages } from "../locale";
import i18n from "./i18n";

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

const i18ns = new Map<string, typeof i18n>();

export async function i18nInstance(language: Languages) {
  if (i18ns.has(language)) {
    return i18ns.get(language);
  }
  const instance = i18n.cloneInstance({ lng: language });
  await instance.changeLanguage(language);
  i18ns.set(language, instance);
  return instance;
}
