'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (value: string) => {
    router.push(pathname.replace(`/${locale}`, `/${value}`));
    router.refresh();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="default" className="size-7">
          <Image
            src={`/assets/icons/${locale}.svg`}
            width={24}
            height={24}
            alt=""
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {AppConfig.locales.map((_locale) => (
          <DropdownItem
            key={_locale}
            value={_locale}
            onClick={() => handleChange(_locale)}
          >
            <Image
              src={`/assets/icons/${_locale}.svg`}
              width={24}
              height={24}
              alt=""
            />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
