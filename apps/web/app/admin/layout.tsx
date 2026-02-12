import { AdminLayout as AdminLayoutComponent } from '@features/admin/admin-layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
