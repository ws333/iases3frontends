import LetterEnglish from '../components/letters/LetterEnglish';

export const faxComponents = {
  English: LetterEnglish,
};

export type LanguageOption = keyof typeof faxComponents;

export const defaultLanguage: LanguageOption = 'English';
export const defaultLanguageOptions: LanguageOption[] = ['English'];
