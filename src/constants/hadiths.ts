import { Translatable } from '../types';

interface Hadith {
    ar: string;
    en: string;
    reference: Translatable;
}

export const HADITHS_OF_THE_DAY: Hadith[] = [
  { 
    ar: 'قال رسول الله صلى الله عليه وسلم: "خيركم من تعلم القرآن وعلمه".', 
    en: 'The Prophet (ﷺ) said, "The best among you (Muslims) are those who learn the Qur\'an and teach it."',
    reference: { ar: 'رواه البخاري', en: 'Sahih al-Bukhari' }
  },
  { 
    ar: 'قال رسول الله صلى الله عليه وسلم: "لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر".', 
    en: 'The Prophet (ﷺ) said: "He who has in his heart the weight of a mustard seed of pride shall not enter Paradise."',
    reference: { ar: 'رواه مسلم', en: 'Sahih Muslim' }
  },
  { 
    ar: 'قال رسول الله صلى الله عليه وسلم: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى".', 
    en: 'The Prophet (ﷺ) said: "Actions are (judged) by motives (niyyah), so each man will have what he intended."',
    reference: { ar: 'متفق عليه', en: 'Bukhari & Muslim' }
  },
  { 
    ar: 'قال رسول الله صلى الله عليه وسلم: "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة".', 
    en: 'The Prophet (ﷺ) said: "He who follows a path in quest of knowledge, Allah will make the path of Jannah easy to him."',
    reference: { ar: 'رواه مسلم', en: 'Sahih Muslim' }
  },
  { 
    ar: 'قال رسول الله صلى الله عليه وسلم: "الكلمة الطيبة صدقة".', 
    en: 'The Prophet (ﷺ) said: "A good word is a charity."',
    reference: { ar: 'متفق عليه', en: 'Bukhari & Muslim' }
  }
];
