'use client';

import { Select, SelectItem } from '@nextui-org/react';
import { useLocale } from 'next-intl';
import type { ChangeEventHandler } from 'react';

import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(pathname, { locale: event.target.value });
    router.refresh();
  };

  return (
    <Select
      color="primary"
      radius="sm"
      size="sm"
      className="w-[70px]"
      defaultSelectedKeys={[`${locale}`]}
      onChange={handleChange}
    >
      {AppConfig.locales.map((_locale) => (
        <SelectItem key={_locale}>{_locale.toUpperCase()}</SelectItem>
      ))}
    </Select>
  );
}
