export default function AuthLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      {children}
    </div>
  );
}
