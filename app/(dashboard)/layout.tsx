import { requireAdmin } from "@/utils/adminAuth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return <>{children}</>;
}
