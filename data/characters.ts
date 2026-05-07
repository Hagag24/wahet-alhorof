import { Character } from '@/types'

export const characters: Character[] = [
  {
    id: 'maryam',
    name: 'مريم',
    image: 'girl-1',
    color: '#FF8FAB',
    description: 'فتاة ذكية تحب التعلم',
  },
  {
    id: 'youssef',
    name: 'يوسف',
    image: 'boy-1',
    color: '#39BDF8',
    description: 'ولد نشيط يساعد الجميع',
  },
  {
    id: 'sami',
    name: 'سامي',
    image: 'boy-2',
    color: '#4ECDC4',
    description: 'يحب الحيوانات والطبيعة',
  },
  {
    id: 'kareem',
    name: 'كريم',
    image: 'boy-3',
    color: '#FFD166',
    description: 'فنان صغير يحب الرسم',
  },
  {
    id: 'rabbit',
    name: 'أرنوب',
    image: 'rabbit',
    color: '#7C5CFF',
    description: 'أرنب سريع ومرح',
  },
  {
    id: 'cat',
    name: 'قطقوطة',
    image: 'cat',
    color: '#FF8FAB',
    description: 'قطة لطيفة وذكية',
  },
  {
    id: 'bird',
    name: 'عصفور',
    image: 'bird',
    color: '#3DDC97',
    description: 'عصفور يغني بصوت جميل',
  },
]

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(char => char.id === id)
}
