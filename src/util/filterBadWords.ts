import { koreanBadWords, englishBadWords } from 'constants/';

const regex = /[^a-zA-z0-9]|^/g;
const splitRegex = /[\s|_]/g;
const replaceRegex = /[A-Za-z0-9_]/g;

const isProfane_ko = (content: string) =>
  koreanBadWords.filter((word) => new RegExp(word, 'g').test(content)).length > 0 || false;

const replaceWord_ko = (content: string) => content.replace(regex, '*').replace(replaceRegex, '*');

const isProfane_en = (content: string) =>
  englishBadWords.filter((word) =>
    new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi').test(content)
  ).length > 0 || false;

const replaceWord_en = (content: string) => content.replace(regex, '').replace(replaceRegex, '*');

const filterBadWords = (content: string) => {
  if (!isProfane_en(content) && !isProfane_ko(content)) {
    return content;
  }

  return content
    .split(splitRegex)
    .map((word) =>
      isProfane_en(word) ? replaceWord_en(word) : isProfane_ko(word) ? replaceWord_ko(word) : word
    )
    .join(splitRegex.exec(content)?.[0]);
};

export default filterBadWords;
