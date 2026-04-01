import type { MediaItem } from '../types';

// SVG avatars as base64 data URLs
function makeSVGAvatar(bgColor: string, initials: string, textColor = '#fff'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="100" fill="${bgColor}"/>
  <circle cx="100" cy="80" r="36" fill="${textColor}" opacity="0.9"/>
  <ellipse cx="100" cy="160" rx="55" ry="40" fill="${textColor}" opacity="0.9"/>
  <text x="100" y="87" text-anchor="middle" dominant-baseline="middle" font-family="Heebo,Arial,sans-serif" font-size="32" font-weight="700" fill="${bgColor}">${initials}</text>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

export const DEFAULT_ITEMS: MediaItem[] = [
  {
    id: 'default-1',
    imageUrl: makeSVGAvatar('#1B5E20', 'סב'),
    names: ['סבא יוסף', 'יוסף'],
    event: 'חתונת הזהב',
    date: '1970-06-15',
    family: 'משפחת לוי',
  },
  {
    id: 'default-2',
    imageUrl: makeSVGAvatar('#1565C0', 'סב'),
    names: ['סבתא מרים', 'מרים'],
    event: 'יום הולדת 70',
    date: '1975-03-22',
    family: 'משפחת לוי',
  },
  {
    id: 'default-3',
    imageUrl: makeSVGAvatar('#6A1B9A', 'אמ'),
    names: ['אמא רחל', 'רחל'],
    event: 'בת מצווה של נעמי',
    date: '1985-09-10',
    family: 'משפחת כהן',
  },
  {
    id: 'default-4',
    imageUrl: makeSVGAvatar('#E65100', 'אב'),
    names: ['אבא דוד', 'דוד'],
    event: 'טיול משפחתי לאילת',
    date: '1990-07-04',
    family: 'משפחת כהן',
  },
  {
    id: 'default-5',
    imageUrl: makeSVGAvatar('#880E4F', 'נע'),
    names: ['נעמי', 'נעמי כהן'],
    event: 'חתונת נעמי',
    date: '1995-05-20',
    family: 'משפחת כהן',
  },
  {
    id: 'default-6',
    imageUrl: makeSVGAvatar('#004D40', 'אר'),
    names: ['ארי', 'ארי לוי'],
    event: 'בר מצווה של ארי',
    date: '1982-11-03',
    family: 'משפחת לוי',
  },
  {
    id: 'default-7',
    imageUrl: makeSVGAvatar('#BF360C', 'תמ'),
    names: ['תמר', 'תמר שפירא'],
    event: 'כנס משפחתי',
    date: '2000-08-15',
    family: 'משפחת שפירא',
  },
  {
    id: 'default-8',
    imageUrl: makeSVGAvatar('#1A237E', 'גד'),
    names: ['גדעון', 'גדעון שפירא'],
    event: 'חג פסח משפחתי',
    date: '2005-04-23',
    family: 'משפחת שפירא',
  },
];
