'use client';

const ProjectLayout = (props: { children: React.ReactNode }) => {
  // const t = useTranslations('ProjectLayout');

  return (
    <div className="flex">
      <div>{props.children}</div>
    </div>
  );
};

export { ProjectLayout };
