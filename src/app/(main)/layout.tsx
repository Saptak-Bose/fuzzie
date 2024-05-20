import Sidebar from "@/components/sidebar";

export default function MainLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}
