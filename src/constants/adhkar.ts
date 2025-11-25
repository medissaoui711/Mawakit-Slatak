import { AdhkarCategory } from '../types';

export const ADHKAR_DATA: AdhkarCategory[] = [
  {
    id: 'morning',
    title: { ar: 'أذكار الصباح', en: 'Morning Adhkar' },
    audioSrc: 'https://archive.org/download/Adhkar-AlSbah-Mishary-Rashid-Alafasy/Adhkar-AlSbah.mp3',
    items: [
      { id: 101, text: { ar: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.', en: 'We have reached the morning and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.' }, count: 1, reference: { ar: 'مسلم', en: 'Muslim' } },
      { id: 102, text: { ar: 'اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت وإليك النشور.', en: 'O Allah, by your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.' }, count: 1, reference: { ar: 'الترمذي', en: 'Tirmidhi' } },
      { id: 103, text: { ar: 'سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.', en: 'Glory is to Allah and praise is to Him, by the multitude of his creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.' }, count: 3, reference: { ar: 'مسلم', en: 'Muslim' } },
    ],
  },
  {
    id: 'evening',
    title: { ar: 'أذكار المساء', en: 'Evening Adhkar' },
    audioSrc: 'https://archive.org/download/Adhkar-AlSbah-Mishary-Rashid-Alafasy/Adhkar-AlMasaa.mp3',
    items: [
      { id: 201, text: { ar: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.', en: 'We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.' }, count: 1, reference: { ar: 'مسلم', en: 'Muslim' } },
      { id: 202, text: { ar: 'اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.', en: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.' }, count: 1, reference: { ar: 'الترمذي', en: 'Tirmidhi' } },
      { id: 203, text: { ar: 'أعوذ بكلمات الله التامات من شر ما خلق.', en: 'I seek refuge in the perfect words of Allah from the evil of that which He has created.' }, count: 3, reference: { ar: 'مسلم', en: 'Muslim' } },
    ],
  },
  {
    id: 'post-prayer',
    title: { ar: 'أذكار بعد الصلاة', en: 'Post-Prayer Adhkar' },
    items: [
      { id: 301, text: { ar: 'أستغفر الله (ثلاثاً).', en: 'I seek the forgiveness of Allah (three times).' }, count: 1, reference: { ar: 'مسلم', en: 'Muslim' } },
      { id: 302, text: { ar: 'سبحان الله (ثلاثاً وثلاثين).', en: 'Glory is to Allah (33 times).' }, count: 1, reference: { ar: 'البخاري', en: 'Bukhari' } },
      { id: 303, text: { ar: 'الحمد لله (ثلاثاً وثلاثين).', en: 'All praise is for Allah (33 times).' }, count: 1, reference: { ar: 'البخاري', en: 'Bukhari' } },
      { id: 304, text: { ar: 'الله أكبر (ثلاثاً وثلاثين).', en: 'Allah is the Most Great (33 times).' }, count: 1, reference: { ar: 'البخاري', en: 'Bukhari' } },
    ],
  },
];

export const DUAS_OF_THE_DAY: { ar: string, en: string }[] = [
  { ar: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.', en: 'O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds.' },
  { ar: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.', en: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.' },
  { ar: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك.', en: 'O Allah, help me to remember You, to give You thanks, and to worship You in the best of manners.' },
  { ar: 'يا مقلب القلوب ثبت قلبي على دينك.', en: 'O Turner of the hearts, make my heart firm upon Your religion.' },
  { ar: 'اللهم إنك عفو تحب العفو فاعف عني.', en: 'O Allah, You are Pardoning and you love pardon, so pardon me.' }
];