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

        <Link href="/admin/create-post" className={cardStyles}>
          <h2 className={titleStyles}>Create Post</h2>
          <p className={descriptionStyles}>Create a new article for the blog.</p>
        </Link>
      </div>
    </div>
  );
}