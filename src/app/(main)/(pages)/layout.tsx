export default function PagesLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="border-l border-t pb-20 h-screen rounded-l-3xl border-muted-foreground/20 overflow-scroll">
      {children}
    </div>
  );
}
