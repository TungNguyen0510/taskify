import { useTranslations } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

const MainLayout = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('MainLayout');

  return (
    <div className="w-full text-black antialiased">
      <div>
        <div className="w-full border-b border-gray-300">
          <header className="mx-auto w-full px-4 md:w-4/5 xl:w-3/4">
            <div className="flex h-14 items-center justify-between">
              <nav>
                <div className="flex items-center gap-x-4 text-base">
                  {props.leftNav}
                </div>
              </nav>

              <nav>
                <div className="flex items-center gap-x-4 text-base">
                  {props.rightNav}
                </div>
              </nav>
            </div>
          </header>
        </div>

        <main className="min-h-[calc(100vh-56px)]">{props.children}</main>

        <div className="w-full border-t border-gray-300">
          <footer className="mx-auto flex w-full justify-end p-4 text-center text-sm md:w-4/5 xl:w-3/4">
            {t('copyright')} © {new Date().getFullYear()} {AppConfig.name}.
          </footer>
        </div>
      </div>
    </div>
  );
};

export { MainLayout };
