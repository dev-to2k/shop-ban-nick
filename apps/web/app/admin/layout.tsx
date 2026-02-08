import { AdminLayout as AdminLayoutComponent } from '@shop-ban-nick/features-admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
