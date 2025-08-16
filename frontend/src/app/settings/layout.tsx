import AppNavigation from "@/components/Navigation/AppNavigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavigation />
      <div className="lg:pl-64">{children}</div>
    </>
  );
}
