import { AdminLayout as AdminLayoutComponent } from '@shop-ban-nick/feature-admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
