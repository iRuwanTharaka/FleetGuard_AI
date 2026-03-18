import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import api from '@/api/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('fg_token');
    if (token) {
      api.get('/user/preferences').then((r) => {
        const lang = r.data?.data?.language;
        if (lang && ['en', 'si', 'ta'].includes(lang)) {
          i18n.changeLanguage(lang);
        }
      }).catch(() => {});
    }
  }, [i18n]);

  const handleChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    try {
      await api.put('/user/preferences', { language: lang });
    } catch {
      // Silently fail if not logged in
    }
  };

  return (
    <Select
      value={i18n.language || 'en'}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[120px] h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="si">සිංහල</SelectItem>
        <SelectItem value="ta">தமிழ்</SelectItem>
      </SelectContent>
    </Select>
  );
}
