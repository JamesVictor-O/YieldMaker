import AppNavigation from "@/components/Navigation/AppNavigation";

export default function SecurityLayout({
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
