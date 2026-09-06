/*
 * Audio metadata for the bundled adhan.
 * The recording is the Makkah adhan attributed to Sheikh Ali Ahmed Mulla,
 * published in the Internet Archive item marked Public Domain.
 */
export interface AdhanVoiceOption {
  id: string;
  nameAr: string;
  nameEn: string;
  muezzin: string;
  description: string;
  audioUrls: string[];
  nativeFile: string;
}

export const BUNDLED_ADHAN_ID = 'makkah-ali-mulla';
export const BUNDLED_ADHAN_FILE = 'adhan.wav';

export const ADHAN_VOICES_LIST: AdhanVoiceOption[] = [
  {
    id: BUNDLED_ADHAN_ID,
    nameAr: 'أذان الحرم المكي — الشيخ علي ملا (دون إنترنت)',
    nameEn: 'Makkah Adhan — Sheikh Ali Mulla (Offline)',
    muezzin: 'الشيخ علي أحمد ملا — أذان مكة المكرمة',
    description: 'تسجيل أذان منسوب للشيخ علي أحمد ملا، منشور في Internet Archive ضمن Public Domain. يستخدم للتشغيل الكامل والإشعارات القصيرة.',
    audioUrls: [],
    nativeFile: BUNDLED_ADHAN_FILE,
  },
];
