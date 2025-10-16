import Link from 'next/link';

export default function AdminDashboard() {
  const cardStyles = "bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer";
  const titleStyles = "text-xl font-bold text-gray-900";
  const descriptionStyles = "text-sm text-gray-600 mt-2";

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome, Admin. Manage your application from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/users" className={cardStyles}>
          <h2 className={titleStyles}>User Management</h2>
          <p className={descriptionStyles}>View, edit, and manage user roles and permissions.</p>
        </Link>

        <Link href="/admin/products" className={cardStyles}>
          <h2 className={titleStyles}>Product Management</h2>
          <p className={descriptionStyles}>Manage products, inventory, and categories.</p>
        </Link>

        <Link href="/admin/orders" className={cardStyles}>
          <h2 className={titleStyles}>Order Management</h2>
          <p className={descriptionStyles}>View and process customer orders.</p>
        </Link>

        <Link href="/admin/analytics" className={cardStyles}>
          <h2 className={titleStyles}>Analytics</h2>
          <p className={descriptionStyles}>View sales reports and business insights.</p>
        </Link>

        <Link href="/admin/settings" className={cardStyles}>
          <h2 className={titleStyles}>Settings</h2>
          <p className={descriptionStyles}>Configure application settings and preferences.</p>
        </Link>

        <Link href="/admin/content" className={cardStyles}>
          <h2 className={titleStyles}>Content Management</h2>
          <p className={descriptionStyles}>Manage website content and pages.</p>
        </Link>
      </div>
    </div>
  );
}