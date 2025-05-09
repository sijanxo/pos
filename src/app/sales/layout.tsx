import Link from "next/link";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="p-4">
        <ul className="flex gap-6">
          <li><Link href="/sales">Sales</Link></li>
          <li><Link href="/sales/products">Products</Link></li>
          <li><Link href="/sales/customers">Customers</Link></li>
          <li><Link href="/sales/reports">Reports</Link></li>
          <li><Link href="/sales/user">User</Link></li>
        </ul>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}