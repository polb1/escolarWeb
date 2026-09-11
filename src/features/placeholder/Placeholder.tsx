interface Props {
  title: string;
  icon: string;
}
export function Placeholder({ title, icon }: Props) {
  return (
    <div className="mx-auto max-w-md pt-16 px-4 text-center">
      <div className="text-6xl mb-3" aria-hidden="true">
        {icon}
      </div>
      <h1 className="font-black text-2xl">{title}</h1>
      <p className="text-inkSoft mt-2">Muy pronto…</p>
    </div>
  );
}
