import { Graph } from '@df/factgraph';

export enum LepLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
  KOREAN = 'ko',
  VIETNAMESE = 'vi',
  RUSSIAN = 'ru',
  ARABIC = 'ar',
  HAITIAN = 'ht',
  TAGALOG = 'tl',
  PORTUGUESE = 'pt',
  POLISH = 'pl',
  FARSI = 'fa',
  FRENCH = 'fr',
  JAPANESE = 'ja',
  GUJARATI = 'gu',
  PUNJABI = 'pa',
  KHMER = 'km',
  URDU = 'ur',
  BENGALI = 'bn',
  ITALIAN = 'it',
  CHINESETRADITIONAL = 'zh-hant',
  CHINESESIMPLIFIED = 'zh-hans',
}

const enabledLanguages = new Set([
  LepLanguage.ENGLISH,
  LepLanguage.SPANISH,
]);

export function isLepLanguageEnabled(language: LepLanguage): boolean {
  return enabledLanguages.has(language);
}

export function fromCode(languageCode: string): LepLanguage {
  const lowerCaseCode = languageCode.toLowerCase();
  for (const lang of Object.values(LepLanguage)) {
    if (lang === lowerCaseCode) {
      return lang;
    }
  }
  throw new Error(`Language not found for code: ${languageCode}`);
}

const PATH_LANGUAGE_PREFERENCE = '/languagePreference';
const PATH_DIRECT_FILE_LANGUAGE_PREFERENCE = '/directFileLanguagePreference';
const DEFAULT_LANGUAGE = LepLanguage.ENGLISH;

export function fromFactGraph(graph: Graph): LepLanguage {
  const factGraphResult = graph.get(PATH_DIRECT_FILE_LANGUAGE_PREFERENCE);
  if (!factGraphResult) {
    console.warn(
      `Did not find language preference fact at path: ${PATH_LANGUAGE_PREFERENCE} or ${PATH_DIRECT_FILE_LANGUAGE_PREFERENCE}; defaulting to ${DEFAULT_LANGUAGE}`
    );
    return DEFAULT_LANGUAGE;
  }

  const languagePreference = factGraphResult.toString();
  try {
    return fromCode(languagePreference);
  } catch (e) {
    throw new Error(
      `Language not found for language preference: ${languagePreference}`
    );
  }
}

export function getDefaultIfNotEnabled(language: LepLanguage): LepLanguage {
  if (isLepLanguageEnabled(language)) {
    return language;
  }
  console.warn(`${language} is not enabled; defaulting to ENGLISH`);
  return DEFAULT_LANGUAGE;
}
