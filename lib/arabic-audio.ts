import { stripArabicDiacritics } from './arabic-tts'

export function slugifyArabicText(text: string): string {
  const clean = stripArabicDiacritics(text)
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s/g, '-')

  return clean || 'empty'
}

